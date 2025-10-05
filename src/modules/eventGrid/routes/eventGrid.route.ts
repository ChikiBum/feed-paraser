import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { EventType } from "../../adsAnalitycs/types/analitycs.type";
import { eventGridSchema } from "../schemas/eventGrid.schema";
import type {
	EventGridRequest,
	EventGridResponse,
	EventGridWhere,
} from "../types/eventGrid.type";

export async function eventGridRoute(fastify: FastifyInstance) {
	fastify.post(
		"/event/grid",
		{
			preValidation: [fastify.authenticate],
			schema: eventGridSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const {
				page = 1,
				pageSize = 50,
				filters = {},
				sort = { field: "createdAt", direction: "desc" },
			} = request.body as EventGridRequest;

			const where: EventGridWhere = {};
			if (filters.type) where.type = filters.type;
			if (filters.adId) where.adId = filters.adId;
			if (filters.anonId) where.anonId = filters.anonId;
			if (filters.dateFrom || filters.dateTo) {
				where.createdAt = {};
				if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
				if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
			}

			const total = await fastify.prisma.event.count({ where });

			const itemsRaw = await fastify.prisma.event.findMany({
				where,
				orderBy: { [sort.field]: sort.direction },
				skip: (page - 1) * pageSize,
				take: pageSize,
			});

			const items = itemsRaw.map((ev) => ({
				id: ev.id,
				anonId: ev.anonId,
				type: ev.type as EventType,
				adId: ev.adId ?? undefined,
				createdAt:
					ev.createdAt instanceof Date
						? ev.createdAt.toISOString()
						: ev.createdAt,
			}));

			const response: EventGridResponse = {
				total,
				page,
				pageSize,
				items,
			};

			reply.send(response);
		},
	);
}
