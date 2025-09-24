import * as cheerio from "cheerio";
import type { FastifyInstance } from "fastify";
import { getNewsSchema } from "../schemas/getNews.schema";
import { getNewsByIdSchema } from "../schemas/getNewsById.schema";
import getUserId from "../service/guard.service";
import { getAllNewsByUser, getNewsById } from "../service/news.service";
import type { News, SerializedNews } from "../types/news.type";

export async function newsRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/all",
		{ preValidation: [fastify.authenticate], schema: getNewsSchema },
		async (_request, reply) => {
			try {
				const userId = getUserId(_request);
				const newsArr = await getAllNewsByUser(fastify, userId);
				const serializedNewsArr: SerializedNews[] = newsArr.map(
					(news: News): SerializedNews => ({
						...news,
						createdAt:
							news.createdAt instanceof Date
								? news.createdAt.toISOString()
								: news.createdAt,
						updatedAt:
							news.updatedAt instanceof Date
								? news.updatedAt.toISOString()
								: news.updatedAt,
					}),
				);
				reply.send({ news: serializedNewsArr });
			} catch (error) {
				fastify.log.error("Error fetching news:", error);
				reply.internalServerError("Could not fetch news");
			}
		},
	);

	fastify.get(
		"/:id",
		{ preValidation: [fastify.authenticate], schema: getNewsByIdSchema },
		async (request, reply) => {
			try {
				const { id } = request.params as { id: string };

				const news = await getNewsById(fastify, id);
				if (!news) {
					reply.notFound("News not found");
					return;
				}

				const h1Selector = process.env.H1_SELECTOR;
				const imgSelector = process.env.IMG_SELECTOR;
				const textSelector = process.env.TEXT_SELECTOR;

				let parsedH1 = null,
					parsedImg = null,
					parsedText = null;
				if (h1Selector || imgSelector || textSelector) {
					try {
						const res = await fetch(news.url);
						const html = await res.text();
						const $ = cheerio.load(html);
					
						if (h1Selector) parsedH1 = $(h1Selector).first().text().trim();
						if (imgSelector)
							parsedImg = $(imgSelector).first().attr("data-src") || null;
					
						if (textSelector)
							parsedText = $(textSelector).text().trim();
					} catch (err) {
						fastify.log.error("Cheerio parse error:", err);
					}
				}

				reply.send({
					...news,
					parsedH1,
					parsedImg,
					parsedText,
				});
			} catch (error) {
				fastify.log.error("Error fetching news by ID:", error);
				reply.internalServerError("Could not fetch news by ID");
			}
		},
	);
}
