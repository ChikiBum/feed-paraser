import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { getFeedDataSchema } from "../schemas/getFeedData.schema";
import { getFeedFromDb, saveFeedToDb } from "../services/feedDbMock.service";
import { parseFeed } from "../services/feedParserMock.service";

const DEFAULT_FEED_URL = "https://example.com/rss";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get("/feed", { schema: getFeedDataSchema }, async (request, reply) => {
		const { url, force } = request.query as { url?: string; force?: string };
		const feedUrl = url || DEFAULT_FEED_URL;

		if (force === "1") {
			const feed = await parseFeed(feedUrl);
			await saveFeedToDb(feedUrl, feed); 
			reply.send({ feed, source: "parsed" });
			return;
		}

		const cachedFeed = await getFeedFromDb(feedUrl);

		if (cachedFeed && cachedFeed.length > 0) {
			reply.send({ feed: cachedFeed as { [x: string]: unknown }[], source: "db" });
			return;
		}

		const feed = await parseFeed(feedUrl);
		await saveFeedToDb(feedUrl, feed);
		reply.send({ feed, source: "parsed" });
	});
}
