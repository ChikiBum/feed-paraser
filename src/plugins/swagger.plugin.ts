import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
	try {
		await fastify.register(fastifySwagger, {
			swagger: {
				info: {
					title: "API docs",
					description: "REST API documentation",
					version: "1.0.0",
				},
				tags: [],
			},
		});

		await fastify.register(fastifySwaggerUi, {
			routePrefix: "/docs",
			uiConfig: {
				docExpansion: "full",
				deepLinking: false,
			},
			staticCSP: true,
		});

		fastify.log.info("Swagger plugin loaded");
	} catch (error) {
		fastify.log.error("Error loading swagger plugin:", error);
		throw error;
	}
};

export default fp(swaggerPlugin, { 
	name: "swagger-plugin",
	fastify: "5.x"
});
