import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify, { type FastifyServerOptions } from "fastify";
import configPlugin from "./config";
import { authRoutes } from "./modules/auth/routes/auth.route";
import { getFeedDataRoutes } from "./modules/feedParser/routes/feedParser.route";
import { newsRoutes } from "./modules/news/routes/news.route";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
	const fastify = Fastify({ logger: true });
	await fastify.register(configPlugin);

	try {
		fastify.decorate("pluginLoaded", (pluginName: string) => {
			fastify.log.info(`✅ Plugin loaded: ${pluginName}`);
		});

		fastify.log.info("Starting to load plugins");
		await fastify.register(AutoLoad, {
			dir: join(__dirname, "plugins"),
			options: options,
			ignorePattern: /^((?!plugin).)*$/,
		});

		fastify.log.info("✅ Plugins loaded successfully");
	} catch (error) {
		fastify.log.error("Error in autoload:", error);
		throw error;
	} finally {
		fastify.log.info("Finished loading plugins");
	}

	fastify.register(getFeedDataRoutes, { prefix: "/feed" });
	fastify.register(authRoutes);
	fastify.register(newsRoutes, { prefix: "/news" });

	return fastify;
}

export default buildApp;
