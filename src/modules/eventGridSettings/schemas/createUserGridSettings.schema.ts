export const createUserGridSettingsSchema = {
	tags: ["userGridSettings"],
	summary: "Create or update user grid settings",
	description: `Save new or update existing grid settings for the current user.
  If a view with the same name exists, it will be updated.
  Example request: POST http://127.0.0.1:3000/user-grid-settings
  Requires Authorization header with Bearer token.`,
	body: {
		type: "object",
		properties: {
			viewName: {
				type: "string",
				description: "Name of the saved view (optional)",
				examples: ["default", "myCustomView"],
			},
			filters: {
				type: "object",
				description: "Applied filters",
				examples: [{ hour: "10:00" }],
			},
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
			pageSize: {
				type: "integer",
				description: "Page size",
				examples: [100],
			},
		},
		required: ["filters", "columns", "sort", "pageSize"],
		examples: [
			{
				viewName: "default",
				filters: { hour: "10:00" },
				columns: ["date", "hour", "uniqueUidInit"],
				sort: [{ field: "date", direction: "desc" }],
				pageSize: 100,
			},
		],
	},
	response: {
		201: {
			type: "object",
			properties: {
				settings: {
					type: "object",
					properties: {
						id: { type: "string", examples: ["651d0b7f4e2d7e001f1e1234"] },
						userId: { type: "string", examples: ["651d0b7f4e2d7e001f1e1111"] },
						viewName: { type: "string", examples: ["default"] },
						filters: { type: "object" },
						columns: { type: "array", items: { type: "string" } },
						sort: {
							type: "array",
							items: {
								type: "object",
								properties: {
									field: { type: "string" },
									direction: { type: "string" },
								},
							},
						},
						pageSize: { type: "integer" },
						createdAt: { type: "string", format: "date-time" },
						updatedAt: { type: "string", format: "date-time" },
					},
					required: [
						"id",
						"userId",
						"viewName",
						"filters",
						"columns",
						"sort",
						"pageSize",
						"createdAt",
						"updatedAt",
					],
				},
			},
			examples: [
				{
					settings: {
						id: "651d0b7f4e2d7e001f1e1234",
						userId: "651d0b7f4e2d7e001f1e1111",
						viewName: "default",
						filters: { hour: "10:00" },
						columns: ["date", "hour", "uniqueUidInit"],
						sort: [{ field: "date", direction: "desc" }],
						pageSize: 100,
						createdAt: "2025-10-01T14:00:00.000Z",
						updatedAt: "2025-10-04T10:00:00.000Z",
					},
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
		400: {
			type: "object",
			properties: {
				message: { type: "string", examples: ["Invalid data"] },
			},
			examples: [{ message: "Invalid data" }],
		},
	},
} as const;
