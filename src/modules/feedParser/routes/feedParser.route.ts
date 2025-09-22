import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { getFeedDataSchema } from "../schemas/getFeedData.schema";

const DEFAULT_FEED_URL = "https://example.com/rss";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get("/data", { schema: getFeedDataSchema }, async (request, reply) => {
		const { url, force } = request.query;
		const feedUrl = url || DEFAULT_FEED_URL;

		if (force) {
			const feed = await parseFeed(feedUrl);
			await saveFeedToDb(feedUrl, feed);
			reply.send({ feed, source: "parsed" });
			return;
		}

		const cachedFeed = await getFeedFromDb(feedUrl);

		if (cachedFeed && cachedFeed.length > 0) {
			reply.send({
				feed: cachedFeed as unknown as { [x: string]: unknown }[],
				source: "db",
			});
			return;
		}

		const feed = await parseFeed(feedUrl);
		await saveFeedToDb(feedUrl, feed);
		reply.send({ feed, source: "parsed" });
	});
}
