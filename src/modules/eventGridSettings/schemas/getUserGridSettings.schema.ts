export const getUserGridSettingsSchema = {
	tags: ["userGridSettings"],
	summary: "Get all grid settings for the authenticated user",
	description: `Retrieve all saved grid settings for the current user. Example request: GET http://127.0.0.1:3000/user-grid-settings
  Requires Authorization header with Bearer token.`,
	response: {
		200: {
			type: "object",
			properties: {
				settings: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
								description: "Settings id",
								examples: ["651d0b7f4e2d7e001f1e1234"],
							},
							viewName: {
								type: "string",
								description: "Name of saved view",
								examples: ["default", "custom1"],
							},
							filters: { type: "object", description: "Applied filters" },
							columns: {
								type: "array",
								items: { type: "string" },
								description: "Visible columns",
								examples: [["date", "hour", "uniqueUidInit"]],
							},
							sort: {
								type: "array",
								items: {
									type: "object",
									properties: {
										field: { type: "string" },
										direction: { type: "string", enum: ["asc", "desc"] },
									},
								},
								description: "Sorting configuration",
							},
							pageSize: { type: "integer", examples: [100] },
							createdAt: { type: "string", format: "date-time" },
							updatedAt: { type: "string", format: "date-time" },
						},
						required: [
							"id",
							"filters",
							"columns",
							"sort",
							"pageSize",
							"createdAt",
							"updatedAt",
						],
					},
				},
			},
			examples: [
				{
					settings: [
						{
							id: "651d0b7f4e2d7e001f1e1234",
							viewName: "default",
							filters: { hour: "10:00" },
							columns: ["date", "hour", "uniqueUidInit"],
							sort: [{ field: "date", direction: "desc" }],
							pageSize: 100,
							createdAt: "2025-10-01T14:00:00.000Z",
							updatedAt: "2025-10-04T10:00:00.000Z",
						},
					],
				},
			],
		},
		401: {
			type: "object",
			properties: {
				message: { type: "string", examples: ["Unauthorized"] },
			},
		},
	},
} as const;
