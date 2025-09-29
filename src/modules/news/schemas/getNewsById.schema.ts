export const getNewsByIdSchema = {
	tags: ["news"],
	summary: "Get news by id",
	description: `Get detailed information about specific news article. Example URL: http://127.0.0.1:3000/news/68d9151a1078a9a131ad3914
  Where 68d9151a1078a9a131ad3914 is the id of the news to retrieve.
  Also need add Authorization header with Bearer token from user login or registration`,
	params: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "MongoDB ObjectId of the news article",
				examples: ["68d9151a1078a9a131ad3914"],
			},
		},
		required: ["id"],
	},
	response: {
		200: {
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
				parsedH1: {
					type: "string",
					nullable: true,
					examples: ["Breaking News: Important Update"],
				},
				parsedImg: {
					type: "string",
					nullable: true,
					examples: ["https://cdn.cnn.com/cnnnext/dam/assets/image.jpg"],
				},
				parsedText: {
					type: "string",
					nullable: true,
					examples: ["Full article text content here..."],
				},
			},
			examples: [
				{
					id: "68d9151a1078a9a131ad3914",
					site: "https://cnn.com",
					url: "https://www.cnn.com/2025/09/28/world/breaking-news/index.html",
					parsed: true,
					forced: false,
					userId: "68d9151a1078a9a131ad3914",
					createdAt: "2025-09-28T14:30:00.000Z",
					updatedAt: "2025-09-28T14:30:00.000Z",
					parsedH1: "Breaking News: Important Update",
					parsedImg: "https://cdn.cnn.com/cnnnext/dam/assets/image.jpg",
					parsedText: "Full article text content here...",
				},
			],
		},
		404: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["News not found"],
				},
			},
			examples: [
				{
					message: "News not found",
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
