import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as xml2js from "xml2js";
import { feedParserSchema } from "../schemas/feedParser.schema";
import type {
  NewsRecord,
  RSSFeed,
  RSSItem,
  SiteShort,
} from "../types/rss-feed.type";


export async function getFeedDataRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/parse",
    {
      schema: feedParserSchema,
      preValidation: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { url } = request.body as { url: string };
      const userId = (request.user as { id: string }).id;

      let feedRaw: string;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return reply.badRequest("Failed to fetch feed");
        }
        feedRaw = await response.text();
      } catch (err) {
        fastify.log.error("Error fetching feed:", err);
        return reply.badRequest("Could not fetch feed");
      }

      let rss: RSSFeed;
      try {
        rss = (await xml2js.parseStringPromise(feedRaw, {
          trim: true,
          explicitArray: false,
        })) as RSSFeed;
      } catch (err) {
        fastify.log.error("Error parsing RSS XML:", err);
        return reply.badRequest("Invalid RSS format");
      }

      const itemsRaw = rss?.rss?.channel?.item;
      const items: RSSItem[] = Array.isArray(itemsRaw)
        ? itemsRaw
        : itemsRaw
        ? [itemsRaw]
        : [];

      if (!items.length) {
        return reply.code(200).send({ news: [] });
      }

      let siteRecord: SiteShort | null;
     
      try {
        siteRecord = await fastify.prisma.site.findUnique({
          where: { feed_userId: { feed: url, userId: userId } },
          select: { id: true, feed: true },
        });


        if (!siteRecord) {  
          await fastify.prisma.site.deleteMany({
            where: { userId: userId },
          });
          await fastify.prisma.news.deleteMany({
            where: { userId: userId },
        });
          const created = await fastify.prisma.site.create({
            data: { feed: url, userId: userId },
          });
          siteRecord = { id: created.id, feed: created.feed };
        } else {
          await fastify.prisma.news.deleteMany({
          where: { siteId: siteRecord.id },
        });
        }

        
      } catch (error) {
        fastify.log.error("Error deleting existing news:", error);
      }

      const limit = Number(process.env.NEW_PER_USER_LIMIT) || 10;

      const iterateItems = limit < items.length ? items.slice(0, limit) : items;

      const newsResults: Array<Pick<NewsRecord, "id" | "site" | "url" | "title">> = [];
      for (const item of iterateItems) {
        const newsUrl = item.link;
        const title = item.title || "";

        try {
          const news = (await fastify.prisma.news.create({
            data: {
              site: url,
              url: newsUrl,
              title,
              siteId: siteRecord!.id,
              userId: userId,
              textContent: item.description || "",
              htmlContent: item.description || "",
            },
          })) as NewsRecord;
          newsResults.push({
            id: news.id,
            site: news.site,
            url: news.url,
            title: news.title,
          });
        } catch (err) {
          fastify.log.error("Error saving news to DB:", err);
        }
      }

      return reply.send({ news: newsResults });
    }
  );

  fastify.post(
    "/test",
    {
      schema: feedParserSchema,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { url } = request.body as { url: string };

      let feedRaw: string;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return reply.badRequest("Failed to fetch feed");
        }
        feedRaw = await response.text();
      } catch (err) {
        fastify.log.error("Error fetching feed:", err);
        return reply.badRequest("Could not fetch feed");
      }

      let rss: RSSFeed;
      try {
        rss = (await xml2js.parseStringPromise(feedRaw, {
          trim: true,
          explicitArray: false,
        })) as RSSFeed;
      } catch (err) {
        fastify.log.error("Error parsing RSS XML:", err);
        return reply.badRequest("Invalid RSS format");
      }

      const itemsRaw = rss?.rss?.channel?.item;
      const items: RSSItem[] = Array.isArray(itemsRaw)
        ? itemsRaw
        : itemsRaw
        ? [itemsRaw]
        : [];

      if (!items.length) {
        return reply.code(200).send({ news: [] });
      }

      const limitedItems = items.slice(0, 10);

      const testNewsResults: Array<
        Pick<NewsRecord, "id"| "site" | "url" | "title">
      > = [];
      for (const item of limitedItems) {
        testNewsResults.push({
          id: item.guid ?? item.link,
          site: url,
          url: item.link,
          title: item.title || "",
        });
      }

      return reply.send({ news: testNewsResults });
    }
  );
}