import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

const pluginName = "prisma-plugin";

export default fp(
  async (fastify) => {
    const prisma = new PrismaClient();

    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async (instance) => {
      try {
        await instance.prisma.$disconnect();
      } catch (err) {
        fastify.log.error("Помилка при закритті Prisma:", err);
        throw err;
      }
    });

    fastify.pluginLoaded(pluginName);
  },
  {
    name: pluginName,
  }
);

