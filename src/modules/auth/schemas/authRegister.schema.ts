export const registerSchema = {
	tags: ["auth"],
	summary: "Register a new user",
	description: `Create new user account. Example request: POST http://127.0.0.1:3000/auth/register
    Body example: { "username": "johndoe", "email": "user@example.com", "password": "password123" }`,
	body: {
		type: "object",
		properties: {
			username: {
				type: "string",
				minLength: 3,
				description: "User display name (optional, minimum 3 characters)",
				examples: ["johndoe"],
			},
			email: {
				type: "string",
				format: "email",
				description: "Valid email address",
				examples: ["user@example.com"],
			},
			password: {
				type: "string",
				minLength: 6,
				description: "Password (minimum 6 characters)",
				examples: ["password123"],
			},
		},
		required: ["email", "password"],
		examples: [
			{
				userName: "johndoe",
				email: "user@example.com",
				password: "password123",
			},
		],
	},
	response: {
		201: {
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
				username: {
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
					username: "johndoe",
					token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
			],
		},
		400: {
			type: "object",
			properties: {
				message: {
					type: "string",
					examples: ["User already exists"],
				},
			},
			examples: [
				{
					message: "User already exists",
				},
			],
		},
	},
} as const;
