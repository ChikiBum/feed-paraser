import type { FastifyInstance } from "fastify";
import type { JWTPayload } from "../../auth/types";
import type { News } from "../types/news.type";

export async function getAllNewsByUser(
	fastify: FastifyInstance,
	userId: string,
) {
	return fastify.prisma.news
		.findMany({
			where: { userId },
			include: { user: true },
		})
		.then((newsArr: (News & { user: JWTPayload | null })[]) =>
			newsArr.map((news) => ({
				id: news.id,
				site: news.site,
				url: news.url,
				parsed: news.parsed,
				forced: news.forced,
				userId: news.user?.id ?? null,
				createdAt: news.createdAt,
				updatedAt: news.updatedAt,
			})),
		);
}

export async function getNewsById(fastify: FastifyInstance, id: string) {
	try {
		const news = await fastify.prisma.news.findUnique({
			where: { id },
			include: { user: true },
		});
		if (!news) return null;
		return {
			id: news.id,
			site: news.site,
			url: news.url,
			parsed: news.parsed,
			forced: news.forced,
			userId: news.user?.id ?? null,
			createdAt: news.createdAt,
			updatedAt: news.updatedAt,
		};
	} catch (error) {
		fastify.log.error("Error fetching news by ID:", error);
		throw error;
	}
}

export async function deleteNewsById(fastify: FastifyInstance, id: string) {
	try {
		await fastify.prisma.news.delete({ where: { id } });
		return true;
	} catch (error) {
		fastify.log.error("Error deleting news:", error);
		return false;
	}
}
