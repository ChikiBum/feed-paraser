export const updateUserGridSettingsSchema = {
	tags: ["userGridSettings"],
	summary: "Update grid settings by id",
	description: `Update an existing grid settings view by its id (PATCH /user-grid-settings/:id).
  Requires Authorization header with Bearer token.`,
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
			},
			visibleColumns: {
				type: "array",
				items: { type: "string" },
				description: "Visible columns",
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
		required: [],
		examples: [
			{
				viewName: "default",
				filters: { hour: "10:00" },
				visibleColumns: ["date", "hour", "uniqueUidInit"],
				sort: [{ field: "date", direction: "desc" }],
				pageSize: 100,
			},
		],
	},
	response: {
		200: {
			type: "object",
			properties: {
				settings: {
					type: "object",
					properties: {
						id: { type: "string" },
						userId: { type: "string" },
						viewName: { type: "string" },
						filters: { type: "object" },
						visibleColumns: { type: "array", items: { type: "string" } },
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
						"visibleColumns",
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
						visibleColumns: ["date", "hour", "uniqueUidInit"],
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
