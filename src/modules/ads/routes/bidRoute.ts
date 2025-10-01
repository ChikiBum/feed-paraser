import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
	applyFilters,
	filterByAnonId,
	filterByBidfloor,
	filterByGeo,
	filterBySize,
} from "../services/creativeFilter";
import { type BidRequest, BidResponse } from "../types/ads.type";

const prisma = new PrismaClient();

export default async function bidRoute(fastify: FastifyInstance) {
	fastify.post(
		"/bid",
		async (
			request: FastifyRequest<{ Body: BidRequest }>,
			reply: FastifyReply,
		) => {
			let req: BidRequest;
			if (typeof request.body === "string") {
				try {
					req = JSON.parse(request.body);
				} catch (err) {
					console.error("JSON parse error:", err);
					return reply.status(400).send({ error: "Invalid JSON" });
				}
			} else {
				req = request.body;
			}
			const allCreatives = await prisma.creative.findMany();

			const pipeline = [
				filterBySize,
				filterByGeo,
				filterByBidfloor,
				filterByAnonId,
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
				requestId: req.adUnitCode,
				creativeId: creative.id,
				adType: creative.adType,
				width: w,
				height: h,
				cpm: Number(creative.minCpm),
				creativeUrl: `/${creative.creativePath}`,
				adContent: `<img src='/${creative.creativePath}' style="width:${w}px;height:${h}px"/>`,
				currency: "USD",
				ttl: 300,
			});
		},
	);
}
