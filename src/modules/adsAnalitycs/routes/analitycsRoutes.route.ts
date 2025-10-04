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


export async function createUserGridSettings(fastify: FastifyInstance) {
	fastify.post(
		"/user-grid-settings",
		{
			schema: {
				body: {
					type: "object",
					properties: {
						anonId: { type: "string" },
						adId: { type: "string" },
					},
					required: ["anonId", "adId"],
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { anonId, adId } = request.body;

			await prisma.userGridSettings.create({
				data: { anonId, adId },
			});

			return reply.send({ status: "ok" });
		},
	);
}

export async function getUserGridSettings(fastify: FastifyInstance) {
	fastify.get(
		"/user-grid-settings/:anonId",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { anonId } = request.params;

			const settings = await prisma.userGridSettings.findUnique({
				where: { anonId },
			});

			if (!settings) {
				return reply.status(404).send({ status: "not found" });
			}

			return reply.send(settings);
		},
	);
}

export async function updateUserGridSettings(fastify: FastifyInstance) {
	fastify.put(
		"/user-grid-settings/:anonId",
		{
			schema: {
				body: {
					type: "object",
					properties: {
						adId: { type: "string" },
					},
					required: ["adId"],
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { anonId } = request.params;
			const { adId } = request.body;

			const settings = await prisma.userGridSettings.findUnique({
				where: { anonId },
			});

			if (!settings) {
				return reply.status(404).send({ status: "not found" });
			}

			await prisma.userGridSettings.update({
				where: { anonId },
				data: { adId },
			});

			return reply.send({ status: "ok" });
		},
	);
}
export async function deleteUserGridSettings(fastify: FastifyInstance) {
	fastify.delete(
		"/user-grid-settings/:anonId",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { anonId } = request.params;

			const settings = await prisma.userGridSettings.findUnique({
				where: { anonId },
			});

			if (!settings) {
				return reply.status(404).send({ status: "not found" });
			}

			await prisma.userGridSettings.delete({
				where: { anonId },
			});

			return reply.send({ status: "ok" });
		},
	);
}	
