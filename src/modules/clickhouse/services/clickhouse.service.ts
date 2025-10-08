import type { FastifyInstance } from "fastify";

interface EventData {
	id: string;
	event_type: string;
	source: string;
	subject: string;
	data: unknown;
	event_time: Date;
}

class ClickHouseService {
	private fastify: FastifyInstance;

	constructor(fastify: FastifyInstance) {
		this.fastify = fastify;
	}

	async insertEvents(events: EventData[]): Promise<void> {
		if (events.length === 0) return;

		try {
			const client = this.fastify.clickhouse.client;

			await client.insert({
				table: "news_feed.events",
				values: events.map((event) => ({
					id: event.id,
					event_type: event.event_type,
					source: event.source,
					subject: event.subject,
					data: JSON.stringify(event.data),
					event_time: event.event_time
						.toISOString()
						.slice(0, 19)
						.replace("T", " "),
				})),
				format: "JSONEachRow",
			});

			this.fastify.log.info(`Inserted ${events.length} events into ClickHouse`);
		} catch (error) {
			this.fastify.log.error("Failed to insert events into ClickHouse:", error);
			throw error;
		}
	}

	async flushCacheToClickHouse(): Promise<void> {
		const { cacheService } = await import("./cache.service");
		const events = cacheService.clearEvents();
		if (events.length > 0) {
			await this.insertEvents(events);
		}
	}
}

export const createClickHouseService = (fastify: FastifyInstance) =>
	new ClickHouseService(fastify);
