import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { getNewsSchema } from "../schemas/getNews.schema";
import { getNewsByIdSchema } from "../schemas/getNewsById.schema";
import  getUserId  from "../service/guard.service";
import { getAllNewsByUser, getNewsById } from "../service/news.service";

export async function newsRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get(
		"/all",
		{ preValidation: [fastify.authenticate], schema: getNewsSchema },
		async (_request, reply) => {
			const userId = getUserId(_request);

			const newsArr = await getAllNewsByUser(fastify, userId);
			const serializedNewsArr = newsArr.map((news) => ({
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
			reply.send(serializedNewsArr);
		},
	);

	route.get(
		"/:id",
		{ preValidation: [fastify.authenticate], schema: getNewsByIdSchema },
		async (request, reply) => {
			const { id } = request.params as { id: string };
			const news = await getNewsById(fastify, id);
			if (!news) {
				reply.code(404).send({ message: "Новина не знайдена" });
			} else {
				reply.send(news);
			}
		},
	);
}
