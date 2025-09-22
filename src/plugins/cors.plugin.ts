import cors from "@fastify/cors";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const corsPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(cors, {
		origin: "http://localhoster",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	});

	fastify.log.info("CORS plugin loaded");
};

export default fp(corsPlugin, { name: "cors-plugin" });
