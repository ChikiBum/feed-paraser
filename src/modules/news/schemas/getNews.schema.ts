export const getNewsSchema = {
	tags: ["news"],
	summary: "Get all news for user",
	description: `Retrieve all news articles for authenticated user with pagination. Example URL: http://127.0.0.1:3000/news/all
  Also need add Authorization header with Bearer token from user login or registration`,
	querystring: {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				description: "User email address for authentication",
				examples: ["user@example.com"],
			},
			password: {
				type: "string",
				description: "User password for authentication",
				examples: ["password123"],
			},
			limit: {
				type: "integer",
				minimum: 1,
				maximum: 100,
				description: "Number of items to return (default: 10)",
				examples: [10],
			},
			offset: {
				type: "integer",
				minimum: 0,
				description: "Number of items to skip (default: 0)",
				examples: [0],
			},
		},
		examples: [
			{
				email: "user@example.com",
				password: "password123",
				limit: 10,
				offset: 0,
			},
		],
	},
	response: {
		401: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["Unauthorized"],
				},
			},
			examples: [
				{
					message: "Unauthorized",
				},
			],
		},
		200: {
			type: "object",
			properties: {
				news: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
								examples: ["68d9151a1078a9a131ad3914"],
							},
							site: {
								type: "string",
								examples: ["https://cnn.com"],
							},
							url: {
								type: "string",
								examples: [
									"https://www.cnn.com/2025/09/28/world/breaking-news/index.html",
								],
							},
							parsed: {
								type: "boolean",
								examples: [true],
							},
							forced: {
								type: "boolean",
								examples: [false],
							},
							userId: {
								type: "string",
								nullable: true,
								examples: ["68d9151a1078a9a131ad3914"],
							},
							createdAt: {
								type: "string",
								format: "date-time",
								examples: ["2025-09-28T14:30:00.000Z"],
							},
							updatedAt: {
								type: "string",
								format: "date-time",
								examples: ["2025-09-28T14:30:00.000Z"],
							},
						},
					},
				},
				total: {
					type: "integer",
					examples: [25],
				},
				limit: {
					type: "integer",
					examples: [10],
				},
				offset: {
					type: "integer",
					examples: [0],
				},
			},
			examples: [
				{
					news: [
						{
							id: "68d9151a1078a9a131ad3914",
							site: "https://cnn.com",
							url: "https://www.cnn.com/2025/09/28/world/breaking-news/index.html",
							parsed: true,
							forced: false,
							userId: "68d9151a1078a9a131ad3914",
							createdAt: "2025-09-28T14:30:00.000Z",
							updatedAt: "2025-09-28T14:30:00.000Z",
						},
					],
					total: 25,
					limit: 10,
					offset: 0,
				},
			],
		},
		500: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["Failed to retrieve news"],
				},
			},
			examples: [
				{
					message: "Failed to retrieve news",
				},
			],
		},
	},
} as const;
