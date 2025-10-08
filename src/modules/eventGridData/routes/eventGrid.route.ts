import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { EventType } from "../../adsAnalitycs/types/analitycs.type";
import { eventGridSchema } from "../schemas/eventGrid.schema";
import type {
	EventGridRequest,
	EventGridResponse,
	EventGridWhere,
} from "../types/eventGrid.type";


export async function eventGridDataRoute(fastify: FastifyInstance) {
	fastify.post(
		"/grid",
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
			console.log("eventGrid.route.ts request.body ", request.body);

			const where: EventGridWhere = {};
			if (filters.type) where.type = filters.type;
			if (filters.adId) where.adId = filters.adId;
			if (filters.anonId) where.anonId = filters.anonId;

			if (filters.createdAt) {
				const filterDate = new Date(filters.createdAt);

				const startOfDay = new Date(filterDate);
				startOfDay.setHours(0, 0, 0, 0);

				const endOfDay = new Date(filterDate);
				endOfDay.setHours(23, 59, 59, 999);

				where.createdAt = {
					gte: startOfDay,
					lte: endOfDay,
				};
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
