import type { FastifyInstance } from "fastify";
import bcrypt from "fastify-bcrypt";
import { loginSchema } from "../schemas/authLogin.schema";
import { registerSchema } from "../schemas/authRegister.schema";

export async function authRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/register",
		{ schema: registerSchema },
		async (request, reply) => {
			const { email, username, password } = request.body as {
				email: string;
				username: string;
				password: string;
			};

			const hash = await fastify.bcrypt.hash(password);
			const user = await fastify.prisma.user.create({
				data: { email, username, password: hash },
			});
			reply
				.code(201)
				.send({ id: user.id, email: user.email, username: user.username });
		},
	);

	fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
		const { email, password } = request.body as {
			email: string;
			password: string;
		};
		const user = await fastify.prisma.user.findUnique({ where: { email } });
		if (!user || !(await fastify.bcrypt.compare(password, user.password))) {
			return reply.code(401).send({ message: "Invalid credentials" });
		}
		const token = fastify.jwt.sign({ id: user.id, email: user.email });
		reply.send({ token });
	});
}
