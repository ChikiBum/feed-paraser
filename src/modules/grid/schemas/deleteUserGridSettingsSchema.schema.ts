export const deleteUserGridSettingsSchema = {
	tags: ["userGridSettings"],
	summary: "Delete grid settings by id",
	description: `Delete user grid settings by its id (DELETE /user-grid-settings/:id). Requires Authorization header with Bearer token.`,
	params: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Grid settings ID (Mongo ObjectId)",
				examples: ["651d0b7f4e2d7e001f1e1234"],
			},
		},
		required: ["id"],
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: { type: "boolean", examples: [true] },
				message: { type: "string", examples: ["Settings deleted"] },
			},
			examples: [
				{
					success: true,
					message: "Settings deleted",
				},
			],
		},
		401: {
			type: "object",
			properties: {
				message: { type: "string", examples: ["Unauthorized"] },
			},
			examples: [{ message: "Unauthorized" }],
		},
		404: {
			type: "object",
			properties: {
				message: { type: "string", examples: ["Settings not found"] },
			},
			examples: [{ message: "Settings not found" }],
		},
		400: {
			type: "object",
			properties: {
				message: { type: "string", examples: ["Invalid data"] },
			},
			examples: [{ message: "Invalid data" }],
		},
	},
} as const;
