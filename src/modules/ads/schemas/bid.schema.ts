export const bidSchema = {
	body: {
		type: "object",
		required: ["anonId", "adUnitCode", "sizes", "pageUrl", "userAgent"],
		properties: {
			anonId: { type: "string", minLength: 1 },
			adUnitCode: { type: "string", minLength: 1 },
			sizes: {
				type: "array",
				items: {
					type: "array",
					items: { type: "number" },
					minItems: 2,
					maxItems: 2,
				},
				minItems: 1,
			},
			pageUrl: { type: "string", format: "uri" },
			userAgent: { type: "string", minLength: 1 },
			geo: { type: "string", minLength: 2, maxLength: 2 },
			bidId: { type: "string" },
			bidfloor: { type: "number", minimum: 0 },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				requestId: { type: "string" },
				adUnitCode: { type: "string" },
				creativeId: { type: "string" },
				adType: { type: "string" },
				width: { type: "number" },
				height: { type: "number" },
				cpm: { type: "number" },
				creativeUrl: { type: "string" },
				adContent: { type: "string" },
				currency: { type: "string" },
				ttl: { type: "number" },
				message: { type: "string" },
				nobid: { type: "boolean" },
				reason: { type: "string" },
			},
		},
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
};
