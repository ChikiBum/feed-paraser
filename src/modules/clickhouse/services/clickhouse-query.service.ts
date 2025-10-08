import type { FastifyInstance } from "fastify";
import type {
	ClickHouseAnalytics,
	ClickHouseEvent,
	EventsQuery,
} from "../types/clickhouse.type";

class ClickHouseQueryService {
	private fastify: FastifyInstance;

	constructor(fastify: FastifyInstance) {
		this.fastify = fastify;
	}

	async getEvents(
		query: EventsQuery,
	): Promise<{ data: ClickHouseEvent[]; total: number }> {
		const client = this.fastify.clickhouse.client;

		const whereConditions: string[] = [];

		if (query.start_date) {
			whereConditions.push(`event_time >= '${query.start_date} 00:00:00'`);
		}
		if (query.end_date) {
			whereConditions.push(`event_time <= '${query.end_date} 23:59:59'`);
		}
		if (query.event_type) {
			whereConditions.push(`event_type = '${query.event_type}'`);
		}
		if (query.source) {
			whereConditions.push(`source = '${query.source}'`);
		}

		const whereClause =
			whereConditions.length > 0
				? `WHERE ${whereConditions.join(" AND ")}`
				: "";

		const dataQuery = `
      SELECT id, event_type, source, subject, data, event_time, created_at
      FROM news_feed.events
      ${whereClause}
      ORDER BY event_time DESC
      LIMIT ${query.limit || 100}
      OFFSET ${query.offset || 0}
    `;

		const countQuery = `
      SELECT count() as total
      FROM news_feed.events
      ${whereClause}
    `;

		const [dataResult, countResult] = await Promise.all([
			client.query({ query: dataQuery, format: "JSONEachRow" }),
			client.query({ query: countQuery, format: "JSONEachRow" }),
		]);

		const data = (await dataResult.json()) as ClickHouseEvent[];
		const countData = (await countResult.json()) as { total: number }[];

		return {
			data,
			total: countData[0]?.total || 0,
		};
	}

	async getAnalytics(query: any): Promise<ClickHouseAnalytics[]> {
		const client = this.fastify.clickhouse.client;

		const whereConditions: string[] = [];
		let groupBy: string;
		let selectFields: string;

		if (query.start_date) {
			whereConditions.push(`date >= '${query.start_date}'`);
		}
		if (query.end_date) {
			whereConditions.push(`date <= '${query.end_date}'`);
		}
		if (query.event_type) {
			whereConditions.push(`event_type = '${query.event_type}'`);
		}
		if (query.source) {
			whereConditions.push(`source = '${query.source}'`);
		}

		switch (query.group_by) {
			case "hour":
				selectFields = "date, hour, event_type, source, sum(count) as count";
				groupBy =
					"GROUP BY date, hour, event_type, source ORDER BY date DESC, hour DESC";
				break;
			case "event_type":
				selectFields = "event_type, sum(count) as count, '' as date";
				groupBy = "GROUP BY event_type ORDER BY count DESC";
				break;
			case "source":
				selectFields = "source, sum(count) as count, '' as date";
				groupBy = "GROUP BY source ORDER BY count DESC";
				break;
			default:
				selectFields = "date, sum(count) as count";
				groupBy = "GROUP BY date ORDER BY date DESC";
		}

		const whereClause =
			whereConditions.length > 0
				? `WHERE ${whereConditions.join(" AND ")}`
				: "";

		const analyticsQuery = `
      SELECT ${selectFields}
      FROM news_feed.events_analytics
      ${whereClause}
      ${groupBy}
      LIMIT 1000
    `;

		const result = await client.query({
			query: analyticsQuery,
			format: "JSONEachRow",
		});

		return (await result.json()) as ClickHouseAnalytics[];
	}
}

export const createClickHouseQueryService = (fastify: FastifyInstance) =>
	new ClickHouseQueryService(fastify);
