export const eventSchema = {
	params: {
		type: "object",
		properties: {
			type: {
				type: "string",
				enum: [
					"click",
					"close",
					"impression",
					"load_page",
					"load_ad_module",
					"auctionInit",
					"auctionEnd",
					"bidRequested",
					"bidResponse",
					"bidWon",
				],
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
