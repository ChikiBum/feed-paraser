import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { createCacheFlushJob } from "../modules/clickhouse/utils/cache-flush.scheduler";

const pluginName = "clickhouse-cache-plugin";

const clickhouseCachePlugin: FastifyPluginAsync = async (fastify) => {
	const timeoutMs = Number(process.env.CLICKHOUSE_CACHE_TIMEOUT) || 60000;

	await fastify.after();

	fastify.ready().then(() => {
		const cacheFlushJob = createCacheFlushJob(fastify, timeoutMs);
		fastify.scheduler.addSimpleIntervalJob(cacheFlushJob);
		fastify.log.info(
			"📅 ClickHouse cache flush scheduler started (runs every minute)",
		);
	});

	fastify.log.info("✅ ClickHouse cache plugin loaded successfully");
	fastify.pluginLoaded(pluginName);
};

export default fp(clickhouseCachePlugin, {
	name: pluginName,
	dependencies: ["schedule-plugin", "clickhouse-plugin"],
});
