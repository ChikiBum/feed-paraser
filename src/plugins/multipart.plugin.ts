import fastifyMultipart from "@fastify/multipart";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const pluginName = "multipart-plugin";

const multipartPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.log.info("Multipart plugin loaded");

	await fastify.register(fastifyMultipart, {
		limits: {
			fileSize: 10 * 1024 * 1024,
			files: 1,
		},
		attachFieldsToBody: false,
	});

	fastify.log.info("✅ Multipart plugin loaded successfully");
	fastify.pluginLoaded(pluginName);
};

export default fp(multipartPlugin, {
	name: pluginName,
});
