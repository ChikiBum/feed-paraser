export const loginSchema = {
	tags: ["auth"],
	summary: "User login",
	description: `Authenticate user and get access token. Example request: POST http://127.0.0.1:3000/auth/login
  Body example: { "email": "user@example.com", "password": "password123" }
  Also need add Authorization header with Bearer token from user login or registration`,
	body: {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				description: "User email address",
				examples: ["user@example.com"],
			},
			password: {
				type: "string",
				description: "User password",
				examples: ["password123"],
			},
		},
		required: ["email", "password"],
		examples: [
			{
				email: "user@example.com",
				password: "password123",
			},
		],
	},
	response: {
		200: {
			type: "object",
			properties: {
				id: {
					type: "string",
					examples: ["68d9151a1078a9a131ad3914"],
				},
				email: {
					type: "string",
					examples: ["user@example.com"],
				},
				userName: {
					type: "string",
					examples: ["johndoe"],
				},
				token: {
					type: "string",
					examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
				},
			},
			examples: [
				{
					id: "68d9151a1078a9a131ad3914",
					email: "user@example.com",
					userName: "johndoe",
					token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
			],
		},
		401: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["Invalid email or password"],
				},
			},
			examples: [
				{
					message: "Invalid email or password",
				},
			],
		},
	},
} as const;
