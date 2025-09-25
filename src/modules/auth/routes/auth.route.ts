import type { FastifyInstance } from "fastify";
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

			const existingUser = await fastify.prisma.user.findUnique({
				where: { email },
			});

			if (existingUser) {
				return reply.conflict("User already exists");
			}
			const hash = await fastify.bcrypt.hash(password);

			const user = await fastify.prisma.user.create({
				data: { email, username, password: hash },
			});

			if (user) {
				const token = fastify.jwt.sign({ id: user.id, email: user.email });
				reply
					.code(201)
					.send({ message: "user created", id: user.id, email: user.email, username: user.username, token });
			}
		},
	);

	fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
		const { email, password } = request.body as {
			email: string;
			password: string;
		};
		const user = await fastify.prisma.user.findUnique({ where: { email } });
		if (!user || !(await fastify.bcrypt.compare(password, user.password))) {
			return reply.unauthorized("Invalid email or password");
		}
		if (user) {
				const token = fastify.jwt.sign({ id: user.id, email: user.email });
				reply
					.code(200)
					.send({ message: "user logged in", id: user.id, email: user.email, username: user.username, token });
			}
	});
	
}
