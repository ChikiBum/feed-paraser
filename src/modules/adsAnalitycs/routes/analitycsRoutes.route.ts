import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventSchema } from "../schemas/event.schema";
import type { Event } from "../types/analitycs.type";

const prisma = new PrismaClient();

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

			await prisma.event.create({
				data: { anonId, adId, type },
			});

			return reply.send({ status: "ok" });
		},
	);
}
