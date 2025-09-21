import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply } from "fastify";
import { loginSchema } from "../schemas/authLogin.schema";
import { registerSchema } from "../schemas/authRegister.schema";
import { getUserFromDb } from "../services/authDbMock.service";

export async function authRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();
	const MOCK_USER = await getUserFromDb(1);

	route.post(
		"/auth/register",
		{ schema: registerSchema },
		async (_request, reply: FastifyReply) => {
			if (!MOCK_USER) {
				reply.code(500).send({ message: "User not found" });
				return;
			}
			reply.code(201).send({
				id: MOCK_USER.id,
				email: MOCK_USER.email,
			});
		},
	);

	route.post(
		"/auth/login",
		{ schema: loginSchema },
		async (request, reply: FastifyReply) => {
			const { email, password } = request.body as {
				email: string;
				password: string;
			};

			if (!MOCK_USER) {
				reply.code(500).send({ message: "User not found" });
				return;
			}

			if (email === MOCK_USER.email && password === MOCK_USER.password) {
				reply.send({ token: "mocked-jwt-token" });
			} else {
				reply.code(401).send({ message: "Невірний email або пароль" });
			}
		},
	);
}
