import type { FastifyInstance } from "fastify";
import { SimpleIntervalJob, Task } from "toad-scheduler";
import { cacheService } from "../services/cache.service";
import { createClickHouseService } from "../services/clickhouse.service";

export function createCacheFlushJob(
	fastify: FastifyInstance,
	timeoutMs = 60000,
): SimpleIntervalJob {
	const task = new Task("cache-flush-task", async () => {
		try {
			const eventCount = cacheService.getEventCount();
			if (eventCount > 0) {
				fastify.log.info(
					`Flushing ${eventCount} events from cache to ClickHouse...`,
				);
				const clickhouseService = createClickHouseService(fastify);
				await clickhouseService.flushCacheToClickHouse();
			}
		} catch (error) {
			fastify.log.error("Error flushing cache to ClickHouse:", error);
		}
	});

	return new SimpleIntervalJob(
		{ milliseconds: timeoutMs, runImmediately: false },
		task,
	);
}
