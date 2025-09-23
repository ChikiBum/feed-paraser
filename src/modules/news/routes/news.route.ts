
import type { FastifyInstance } from "fastify";
import { getNewsSchema } from "../schemas/getNews.schema";
import { getNewsByIdSchema } from "../schemas/getNewsById.schema";
import  getUserId  from "../service/guard.service";
import { getAllNewsByUser, getNewsById } from "../service/news.service";
import type { News, SerializedNews } from "../types/news.type";

export async function newsRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/all",
		{ preValidation: [fastify.authenticate], schema: getNewsSchema },
		async (_request, reply) => {
			try {
				const userId = getUserId(_request);
				console.log('userId ', userId);
				const newsArr = await getAllNewsByUser(fastify, userId);
console.log('newsArr ', newsArr);
				const serializedNewsArr: SerializedNews[] = newsArr.map((news: News): SerializedNews => ({
					...news,
					createdAt:
						news.createdAt instanceof Date
							? news.createdAt.toISOString()
							: news.createdAt,
					updatedAt:
						news.updatedAt instanceof Date
							? news.updatedAt.toISOString()
							: news.updatedAt,
				}));
				reply.send({ news: serializedNewsArr });
			} catch (error) {
				fastify.log.error("Error fetching news:", error);
				reply.internalServerError("Could not fetch news");
			}
		}
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
				} else {
					reply.send(news);
				}
			} catch (error) {
				fastify.log.error("Error fetching news by ID:", error);
				reply.internalServerError("Could not fetch news by ID");
			}
		}
	);
}
