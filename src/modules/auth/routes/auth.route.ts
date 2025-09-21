import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { loginSchema } from "../schemas/authLogin.schema";
import { registerSchema } from "../schemas/authRegister.schema";

const MOCK_USER = {
	id: "user_1",
	email: "test@example.com",
	password: "password123", // у реальному застосунку паролі не зберігають відкрито!
};

export async function authRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.post(
		"/auth/register",
		{ schema: registerSchema },
		async (_request, reply) => {
			reply.code(201).send({
				id: MOCK_USER.id,
				email: MOCK_USER.email,
			});
		},
	);

	route.post("/auth/login", { schema: loginSchema }, async (request, reply) => {
		const { email, password } = request.body as {
			email: string;
			password: string;
		};

		if (email === MOCK_USER.email && password === MOCK_USER.password) {
			reply.send({ token: "mocked-jwt-token" });
		} else {
			reply.code(401).send({ message: "Невірний email або пароль" });
		}
	});
}
