import path, { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify, { type FastifyServerOptions } from "fastify";
import configPlugin from "./config";
import bidRoute from "./modules/ads/routes/bidRoute";
import analyticsRoute from "./modules/adsAnalitycs/routes/analitycsRoutes";
import { authRoutes } from "./modules/auth/routes/auth.route";
import { getFeedDataRoutes } from "./modules/feedParser/routes/feedParser.route";
import { createScheduledFeedJob } from "./modules/feedParser/services/feedScheduler.service";
import { newsRoutes } from "./modules/news/routes/news.route";
import { ssrRoute } from "./modules/ssr/routes/ssrRoute";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
	const fastify = Fastify({ logger: true });
	await fastify.register(configPlugin);

	fastify.addContentTypeParser(
		"text/plain",
		{ parseAs: "string" },
		(_req, body, done) => {
			try {
				const bodyString = typeof body === "string" ? body : body.toString();
				const json = JSON.parse(bodyString);
				done(null, json);
			} catch (err) {
				err.statusCode = 400;
				done(err, undefined);
			}
		},
	);

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

	await fastify.register(require("@fastify/static"), {
		root: path.join(process.cwd(), "public"),
		prefix: "/",
	});

	fastify.register(getFeedDataRoutes, { prefix: "/feed" });
	fastify.register(authRoutes, { prefix: "/auth" });
	fastify.register(newsRoutes, { prefix: "/news" });
	fastify.register(ssrRoute, { prefix: "/ssr" });
	fastify.register(bidRoute, { prefix: "/ads" });
	fastify.register(analyticsRoute, { prefix: "/ads" });

	fastify.ready().then(() => {
		const feedJob = createScheduledFeedJob(
			fastify,
			process.env.SCHEDULER_TIMEOUT
				? Number(process.env.SCHEDULER_TIMEOUT)
				: undefined,
		);
		fastify.scheduler.addSimpleIntervalJob(feedJob);
		fastify.log.info("📅 RSS Feed scheduler started (runs every minutes)");
	});

	return fastify;
}

export default buildApp;
