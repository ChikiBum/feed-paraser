export const deleteNewsByIdSchema = {
	tags: ["news"],
	summary: "Delete news by id",
	description: `Delete a news article by its MongoDB ObjectId. Example URL: http://127.0.0.1:3000/news/68d9151a1078a9a131ad3914
	Where 68d9151a1078a9a131ad3914 is the id of the news to delete.
  Also need add Authorization header with Bearer token from user login or registration`,
	params: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "MongoDB ObjectId of the news article to delete",
				examples: ["68d9151a1078a9a131ad3914"],
			},
		},
		required: ["id"],
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					examples: [true],
				},
				message: {
					type: "string",
					examples: ["News deleted successfully"],
				},
			},
			examples: [
				{
					success: true,
					message: "News deleted successfully",
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
	},
} as const;
