import { createClient } from "@clickhouse/client";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { clickhouseConfig } from "../config/clickhouse.config";

const pluginName = "clickhouse-plugin";

const clickhousePlugin: FastifyPluginAsync = async (fastify) => {
	const client = createClient(clickhouseConfig);

	fastify.decorate("clickhouse", {
		client,
		async ping(): Promise<boolean> {
			try {
				await client.query({ query: "SELECT 1" });
				return true;
			} catch (error) {
				fastify.log.error("ClickHouse ping failed:", error);
				return false;
			}
		},
		async close(): Promise<void> {
			await client.close();
		},
	});

	fastify.addHook("onClose", async () => {
		await fastify.clickhouse.close();
	});

	fastify.log.info("✅ ClickHouse plugin loaded successfully");
	fastify.pluginLoaded(pluginName);
};

export default fp(clickhousePlugin, {
	name: pluginName,
});
