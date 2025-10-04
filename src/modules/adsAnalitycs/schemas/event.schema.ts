import { EVENT_TYPES } from "../types/analitycs.type";
export const eventSchema = {
	params: {
		type: "object",
		properties: {
			type: {
				type: "string",
				enum: EVENT_TYPES,
			},
		},
		required: ["type"],
	},
	body: {
		type: "object",
		properties: {
			anonId: { type: "string" },
			adId: { type: "string" },
			meta: { type: "object", additionalProperties: true },
		},
		required: ["anonId"],
	},
	response: {
		200: {
			type: "object",
			properties: {
				status: { type: "string" },
			},
		},
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
} as const;
