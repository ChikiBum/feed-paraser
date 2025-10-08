import type { FastifyInstance } from "fastify";
import {
	getAnalyticsSchema,
	getEventsSchema,
} from "../schemas/clickhouse.schema";
import { createClickHouseQueryService } from "../services/clickhouse-query.service";
import type { EventsQuery } from "../types/clickhouse.type";

async function clickhouseRoutes(fastify: FastifyInstance) {
	const clickhouseQueryService = createClickHouseQueryService(fastify);

	fastify.get("/events", {
		schema: getEventsSchema,
		handler: async (request, reply) => {
			try {
				const query = request.query as EventsQuery;
				const result = await clickhouseQueryService.getEvents(query);

				return reply.send({
					data: result.data,
					total: result.total,
					limit: query.limit || 100,
					offset: query.offset || 0,
				});
			} catch (error: any) {
				fastify.log.error("Error fetching events from ClickHouse:", error);
				reply.code(500);
				return reply.send({
					error: "Failed to fetch events",
					message: error.message,
				});
			}
		},
	});

	fastify.get("/analytics", {
		schema: getAnalyticsSchema,
		handler: async (request, reply) => {
			try {
				const query = request.query;
				const result = await clickhouseQueryService.getAnalytics(query);

				return reply.send(result);
			} catch (error: any) {
				fastify.log.error("Error fetching analytics from ClickHouse:", error);
				reply.code(500);
				return reply.send({
					error: "Failed to fetch analytics",
					message: error.message,
				});
			}
		},
	});

	fastify.get("/health", {
		handler: async (request, reply) => {
			try {
				const isHealthy = await fastify.clickhouse.ping();

				if (isHealthy) {
					return reply.send({
						status: "healthy",
						timestamp: new Date().toISOString(),
					});
				} else {
					reply.code(503);
					return reply.send({
						status: "unhealthy",
						timestamp: new Date().toISOString(),
					});
				}
			} catch (error: any) {
				fastify.log.error("ClickHouse health check failed:", error);
				reply.code(503);
				return reply.send({
					status: "unhealthy",
					error: error.message,
					timestamp: new Date().toISOString(),
				});
			}
		},
	});
}

export default clickhouseRoutes;
