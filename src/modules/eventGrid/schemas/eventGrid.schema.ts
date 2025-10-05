import { EVENT_TYPES } from "../types/analitycs.type";

export const eventGridSchema = {
	tags: ["analytics", "grid"],
	summary: "Get events for grid view",
	description: `Returns paginated, filtered and sorted event data for grid. Protected route.`,
	body: {
		type: "object",
		properties: {
			page: { type: "integer", minimum: 1, default: 1 },
			pageSize: { type: "integer", minimum: 1, maximum: 500, default: 50 },
			filters: {
				type: "object",
				properties: {
					type: { type: "string", enum: EVENT_TYPES },
					adId: { type: "string" },
					anonId: { type: "string" },
					dateFrom: { type: "string", format: "date-time" },
					dateTo: { type: "string", format: "date-time" },
				},
				additionalProperties: false,
			},
			sort: {
				type: "object",
				properties: {
					field: {
						type: "string",
						enum: ["createdAt", "type", "adId", "anonId"],
					},
					direction: { type: "string", enum: ["asc", "desc"] },
				},
				additionalProperties: false,
			},
		},
		required: [],
	},
	response: {
		200: {
			type: "object",
			properties: {
				total: { type: "integer" },
				page: { type: "integer" },
				pageSize: { type: "integer" },
				items: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							anonId: { type: "string" },
							type: { type: "string", enum: EVENT_TYPES },
							adId: { type: "string" },
							createdAt: { type: "string", format: "date-time" },
						},
						required: ["id", "anonId", "type", "createdAt"],
					},
				},
			},
		},
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
} as const;
