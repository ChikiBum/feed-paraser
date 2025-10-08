import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { cacheService } from "../../clickhouse/services/cache.service";
import { eventSchema } from "../schemas/event.schema";
import type { Event } from "../types/analitycs.type";

export async function analyticsRoute(fastify: FastifyInstance) {
	fastify.post(
		"/event/:type",
		{
			schema: eventSchema,
		},
		async (
			request: FastifyRequest<{
				Params: { type: Event["type"] };
				Body: { anonId: string; adId: string };
			}>,
			reply: FastifyReply,
		) => {
			const { type } = request.params;
			const { anonId, adId } = request.body;

			await fastify.prisma.event.create({
				data: { anonId, adId, type },
			});

			cacheService.addEvent({
				id: uuidv4(),
				event_type: `ads_${type}`,
				source: "ads_analytics",
				subject: `/ads/event/${type}`,
				data: { anonId, adId, type },
				event_time: new Date(),
			});

			fastify.log.info(`Analytics event cached: ${type} for ad ${adId}`);

			return reply.send({ status: "ok" });
		},
	);
}
