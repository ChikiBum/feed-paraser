export const uploadSuccessSchema = {
	type: "object",
	properties: {
		success: {
			type: "boolean",
			const: true,
		},
		message: {
			type: "string",
			minLength: 1,
		},
		lineItemsCount: {
			type: "number",
			minimum: 0,
		},
		creativeId: {
			type: "string",
			minLength: 1,
		},
		user: {
			type: "object",
			properties: {
				id: {
					type: "string",
					minLength: 1,
				},
				email: {
					type: "string",
					format: "email",
				},
				userName: {
					type: "string",
				},
			},
			required: ["id", "email"],
			additionalProperties: false,
		},
	},
	required: ["success", "message", "lineItemsCount", "creativeId", "user"],
	additionalProperties: false,
} as const;

export const uploadErrorSchema = {
	type: "object",
	properties: {
		error: {
			type: "string",
			minLength: 1,
		},
		statusCode: {
			type: "number",
			minimum: 400,
			maximum: 599,
		},
	},
	required: ["error", "statusCode"],
	additionalProperties: false,
} as const;
