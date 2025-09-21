import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { getNewsSchema } from "../schemas/getNews.schema";
import { getNewsByIdSchema } from "../schemas/getNewsById.schema";

export async function newsRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/all", { schema: getNewsSchema }, async (_request, reply) => {
    reply.send([
      { id: "1", title: "Новина 1", content: "Текст новини", date: new Date().toISOString() }
    ]);
  });

  route.get("/:id", { schema: getNewsByIdSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };

    if (id === "1") {
      reply.send({ id: "1", title: "Новина 1", content: "Текст новини", date: new Date().toISOString() });
    } else {
      reply.code(404).send({ message: "Новина не знайдена" });
    }
  });
}