import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";

const fastify = Fastify();
const prisma = new PrismaClient();

fastify.get("/users", async (_request, reply) => {
	const users = await prisma.user.findMany();
	reply.send(users);
});
