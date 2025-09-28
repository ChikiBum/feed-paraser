import type { FastifyInstance } from "fastify";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import * as xml2js from "xml2js";
import type { RSSFeed, RSSItem } from "../types/rss-feed.type";

async function parseFeedAndUpdateNews(
	fastify: FastifyInstance,
	feedUrl: string,
	userId: string,
): Promise<number> {
	try {
		fastify.log.info(`Parsing feed: ${feedUrl} for user: ${userId}`);

		const response = await fetch(feedUrl);
		if (!response.ok) {
			fastify.log.error(
				`Failed to fetch feed: ${feedUrl} (Status: ${response.status})`,
			);
			return 0;
		}

		const feedRaw = await response.text();

		const rss = (await xml2js.parseStringPromise(feedRaw, {
			trim: true,
			explicitArray: false,
		})) as RSSFeed;

		fastify.log.info(
			`RSS structure: ${JSON.stringify(
				{
					hasRss: !!rss.rss,
					hasChannel: !!rss?.rss?.channel,
					hasItems: !!rss?.rss?.channel?.item,
					itemsType: typeof rss?.rss?.channel?.item,
					itemsLength: Array.isArray(rss?.rss?.channel?.item)
						? rss.rss.channel.item.length
						: "not array",
				},
				null,
				2,
			)}`,
		);

		const itemsRaw = rss?.rss?.channel?.item;
		const items: RSSItem[] = Array.isArray(itemsRaw)
			? itemsRaw
			: itemsRaw
				? [itemsRaw]
				: [];

		if (!items.length) {
			fastify.log.info(`No items found in feed: ${feedUrl}`);
			return 0;
		}

		const deletedResult = await fastify.prisma.news.deleteMany({
			where: {
				site: feedUrl,
				userId: userId,
			},
		});

		fastify.log.info(
			`Deleted ${deletedResult.count} old news for feed: ${feedUrl} and user: ${userId}`,
		);

		let addedCount = 0;
		for (const item of items) {
			try {
				fastify.log.info(
					`Processing item: ${JSON.stringify(
						{
							title: item.title,
							link: item.link,
							description: item.description?.substring(0, 100),
							hasTitle: !!item.title,
							hasLink: !!item.link,
							hasDescription: !!item.description,
						},
						null,
						2,
					)}`,
				);

				await fastify.prisma.news.create({
					data: {
						site: feedUrl,
						url: item.link,
						title: item.title || "",
						textContent: item.description || "",
						htmlContent: item.description || "",
						userId: userId,
					},
				});
				addedCount++;
				fastify.log.info(
					`✓ Successfully saved for user ${userId}: ${item.title}`,
				);
			} catch (error) {
				fastify.log.error(`Error saving article: ${item.title}`, error);
			}
		}

		fastify.log.info(
			`✅ Added ${addedCount} new articles from ${feedUrl} for user ${userId}`,
		);
		return addedCount;
	} catch (error) {
		fastify.log.error(`Error parsing feed ${feedUrl}:`, error);
		return 0;
	}
}

export async function updateAllFeeds(fastify: FastifyInstance): Promise<void> {
	try {
		fastify.log.info("🚀 Starting scheduled feed update...");

			const sites = await fastify.prisma.site.findMany({
			select: {
				feed: true,
				userId: true,
				id: true,
			},
		});

		if (!sites.length) {
			fastify.log.info("📭 No sites found to update");
			return;
		}

		let totalUpdated = 0;
		let processedFeeds = 0;

		for (const site of sites) {
			if (!site.userId) {
				fastify.log.warn(`Site ${site.feed} has no userId, skipping...`);
				continue;
			}

			fastify.log.info(
				`Processing site: ${site.feed} for user: ${site.userId}`,
			);
			const updatedCount = await parseFeedAndUpdateNews(
				fastify,
				site.feed,
				site.userId,
			);
			totalUpdated += updatedCount;
			processedFeeds++;
		}

		fastify.log.info(
			`🎉 Feed update completed! Processed ${processedFeeds} sites with ${totalUpdated} total articles`,
		);
	} catch (error) {
		fastify.log.error("❌ Error in scheduled feed update:", error);
	}
}

export function createScheduledFeedJob(
	fastify: FastifyInstance,
	timeoutSeconds: number = 120,
): SimpleIntervalJob {
	const task = new AsyncTask(
		"RSS Feed Update Task",
		() => updateAllFeeds(fastify),
		(err?: Error) => {
			if (err) {
				fastify.log.error(`❌ Scheduled feed update failed: ${err.message}`);
			}
		},
	);

	return new SimpleIntervalJob({ seconds: timeoutSeconds }, task);
}
