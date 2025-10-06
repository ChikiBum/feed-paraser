import fastifySchedule from "@fastify/schedule";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const pluginName = "schedule-plugin";

const schedulePlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(fastifySchedule);
	fastify.log.info("✅ Schedule plugin loaded successfully");
	fastify.pluginLoaded(pluginName);
};

export default fp(schedulePlugin, {
	name: pluginName,
});
