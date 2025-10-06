import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { bidSchema } from "../schemas/bid.schema";
import {
	applyFilters,
	filterByAnonId,
	filterByBidfloor,
	filterByGeo,
	filterBySize,
} from "../services/creativeFilter";
import type { BidRequest } from "../types/ads.type";

const prisma = new PrismaClient();

export default async function bidRoute(fastify: FastifyInstance) {
	fastify.post(
		"/bid",
		{
			schema: bidSchema,
		},
		async (
			request: FastifyRequest<{ Body: BidRequest }>,
			reply: FastifyReply,
		) => {
			const req = request.body;

			const allCreatives = await prisma.creative.findMany();

			const pipeline = [
				filterBySize,
				filterByGeo,
				filterByBidfloor,
				// filterByAnonId,
			];

			const filtered = await applyFilters(allCreatives, req, pipeline);

			if (!filtered.length) {
				return reply.send({ requestId: req.adUnitCode, nobid: true });
			}

			const creative = filtered[0];
			const [w, h] = req.sizes[0];

			await prisma.event.create({
				data: {
					anonId: req.anonId,
					type: "impression",
					adId: creative.id,
				},
			});

			return reply.send({
				requestId: req.bidId,
				adUnitCode: req.adUnitCode,
				creativeId: creative.id,
				adType: creative.adType,
				width: w,
				height: h,
				cpm: Number(creative.minCpm),
				creativeUrl: `/${creative.creativePath}`,
				adContent: `<img src='${process.env.API_BASE_URL}/${creative.creativePath}' style="width:${w}px;height:${h}px"/>`,
				currency: "USD",
				ttl: 300,
			});
		},
	);
}
