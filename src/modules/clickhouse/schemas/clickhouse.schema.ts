export const getEventsSchema = {
	tags: ["clickhouse"],
	summary: "Get events from ClickHouse",
	description:
		"Retrieve events from ClickHouse analytics database with filtering and pagination support",
	querystring: {
		type: "object",
		properties: {
			limit: {
				type: "integer",
				minimum: 1,
				maximum: 1000,
				description: "Number of events to return",
				examples: [100],
			},
			offset: {
				type: "integer",
				minimum: 0,
				description: "Number of events to skip for pagination",
				examples: [0],
			},
			start_date: {
				type: "string",
				format: "date",
				description: "Filter events from this date (YYYY-MM-DD)",
				examples: ["2025-10-07"],
			},
			end_date: {
				type: "string",
				format: "date",
				description: "Filter events to this date (YYYY-MM-DD)",
				examples: ["2025-10-08"],
			},
			event_type: {
				type: "string",
				description: "Filter by specific event type",
				examples: ["ads_click", "ads_view", "ads_impression"],
			},
			source: {
				type: "string",
				description: "Filter by event source",
				examples: ["ads_analytics", "event_grid"],
			},
		},
		examples: [
			{
				limit: 100,
				offset: 0,
				start_date: "2025-10-07",
				end_date: "2025-10-08",
				event_type: "ads_click",
				source: "ads_analytics",
			},
		],
	},
	response: {
		200: {
			type: "object",
			properties: {
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
								examples: ["uuid-123-456"],
							},
							event_type: {
								type: "string",
								examples: ["ads_click"],
							},
							source: {
								type: "string",
								examples: ["ads_analytics"],
							},
							subject: {
								type: "string",
								examples: ["/ads/event/click"],
							},
							data: {
								type: "string",
								description: "JSON string containing event data",
								examples: ['{"anonId":"user123","adId":"ad456"}'],
							},
							event_time: {
								type: "string",
								format: "date-time",
								examples: ["2025-10-07 19:30:15"],
							},
							created_at: {
								type: "string",
								format: "date-time",
								examples: ["2025-10-07 19:31:00"],
							},
						},
					},
				},
				total: {
					type: "integer",
					examples: [150],
				},
				limit: {
					type: "integer",
					examples: [100],
				},
				offset: {
					type: "integer",
					examples: [0],
				},
			},
			examples: [
				{
					data: [
						{
							id: "uuid-123-456",
							event_type: "ads_click",
							source: "ads_analytics",
							subject: "/ads/event/click",
							data: '{"anonId":"user123","adId":"ad456"}',
							event_time: "2025-10-07 19:30:15",
							created_at: "2025-10-07 19:31:00",
						},
					],
					total: 150,
					limit: 100,
					offset: 0,
				},
			],
		},
		500: {
			type: "object",
			properties: {
				error: {
					type: "string",
					examples: ["Failed to fetch events"],
				},
				message: {
					type: "string",
					examples: ["Internal server error"],
				},
			},
			examples: [
				{
					error: "Failed to fetch events",
					message: "Internal server error",
				},
			],
		},
	},
} as const;

export const getAnalyticsSchema = {
	tags: ["clickhouse"],
	summary: "Get analytics data from ClickHouse",
	description:
		"Retrieve aggregated analytics data with various grouping options",
	querystring: {
		type: "object",
		properties: {
			group_by: {
				type: "string",
				enum: ["day", "hour", "event_type", "source"],
				description: "How to group analytics data",
				examples: ["event_type"],
			},
			start_date: {
				type: "string",
				format: "date",
				description: "Filter analytics from this date (YYYY-MM-DD)",
				examples: ["2025-10-07"],
			},
			end_date: {
				type: "string",
				format: "date",
				description: "Filter analytics to this date (YYYY-MM-DD)",
				examples: ["2025-10-08"],
			},
			event_type: {
				type: "string",
				description: "Filter by specific event type",
				examples: ["ads_click"],
			},
			source: {
				type: "string",
				description: "Filter by event source",
				examples: ["ads_analytics"],
			},
		},
		examples: [
			{
				group_by: "event_type",
				start_date: "2025-10-07",
				end_date: "2025-10-08",
			},
		],
	},
	response: {
		200: {
			type: "array",
			items: {
				type: "object",
				properties: {
					date: {
						type: "string",
						description: "Date (empty for non-date groupings)",
						examples: ["2025-10-07", ""],
					},
					hour: {
						type: "integer",
						description: "Hour (only for hour grouping)",
						examples: [19],
						minimum: 0,
						maximum: 23,
					},
					event_type: {
						type: "string",
						description: "Event type (only for event_type grouping)",
						examples: ["ads_click"],
					},
					source: {
						type: "string",
						description: "Source (only for source grouping)",
						examples: ["ads_analytics"],
					},
					count: {
						type: "integer",
						description: "Number of events",
						examples: [150],
					},
				},
			},
			examples: [
				[
					{
						event_type: "ads_click",
						count: 150,
						date: "",
					},
					{
						event_type: "ads_view",
						count: 89,
						date: "",
					},
				],
			],
		},
		500: {
			type: "object",
			properties: {
				error: {
					type: "string",
					examples: ["Failed to fetch analytics"],
				},
				message: {
					type: "string",
					examples: ["Internal server error"],
				},
			},
			examples: [
				{
					error: "Failed to fetch analytics",
					message: "Internal server error",
				},
			],
		},
	},
} as const;

export const healthCheckSchema = {
	tags: ["clickhouse"],
	summary: "ClickHouse health check",
	description: "Check ClickHouse database connection and availability",
	response: {
		200: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: ["healthy"],
					examples: ["healthy"],
				},
				timestamp: {
					type: "string",
					format: "date-time",
					examples: ["2025-10-07T19:32:52.652Z"],
				},
			},
			examples: [
				{
					status: "healthy",
					timestamp: "2025-10-07T19:32:52.652Z",
				},
			],
		},
		503: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: ["unhealthy"],
					examples: ["unhealthy"],
				},
				error: {
					type: "string",
					examples: ["Connection timeout"],
				},
				timestamp: {
					type: "string",
					format: "date-time",
					examples: ["2025-10-07T19:32:52.652Z"],
				},
			},
			examples: [
				{
					status: "unhealthy",
					error: "Connection timeout",
					timestamp: "2025-10-07T19:32:52.652Z",
				},
			],
		},
	},
} as const;
