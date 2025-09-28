export const feedParserSchema = {
	tags: ["feed"],
	summary: "Parse RSS feed and save news links",
	description: `Parse RSS feed URL and extract news articles. 
  Example request: POST http://127.0.0.1:3000/feed/parse
  body example: { "url": "https://www.kashtan.news/feed/"}
  Also need add Authorization header with Bearer token from user login or registration`,
	body: {
		type: "object",
		properties: {
			url: {
				type: "string",
				format: "uri",
				description: "Valid RSS feed URL",
				examples: ["https://rss.cnn.com/rss/edition.rss"],
			},
		},
		required: ["url"],
		examples: [
			{
				url: "https://rss.cnn.com/rss/edition.rss",
			},
		],
	},
	response: {
		200: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["Feed parsed successfully"],
				},
				count: {
					type: "number",
					examples: [15],
				},
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
							title: {
								type: "string",
								examples: ["Breaking News: Important Update"],
							},
						},
						required: ["id", "site", "url", "title"],
					},
				},
			},
			examples: [
				{
					message: "Feed parsed successfully",
					count: 2,
					news: [
						{
							id: "68d9151a1078a9a131ad3914",
							site: "https://cnn.com",
							url: "https://www.cnn.com/2025/09/28/world/breaking-news/index.html",
							title: "Breaking News: Important Update",
						},
					],
				},
			],
		},
		400: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["Invalid RSS feed URL"],
				},
			},
			examples: [
				{
					message: "Invalid RSS feed URL",
				},
			],
		},
		500: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["Failed to parse RSS feed"],
				},
			},
			examples: [
				{
					message: "Failed to parse RSS feed",
				},
			],
		},
	},
} as const;
