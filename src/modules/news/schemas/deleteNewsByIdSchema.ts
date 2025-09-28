export const deleteNewsByIdSchema = {
	tags: ["news"],
	summary: "Delete news by id",
	params: {
		type: "object",
		properties: {
			id: { type: "string" },
		},
		required: ["id"],
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: { type: "boolean" },
				message: { type: "string" },
			},
		},
		404: {
			type: "object",
			properties: {
				message: { type: "string" },
			},
		},
	},
} as const;
