import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const authPlugin: FastifyPluginAsync = async (fastify) => {

  fastify.log.info("Auth plugin loaded");

	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});


  fastify.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (!request.user) {
        reply.unauthorized("User ID not found");
      }
    } catch {
      reply.unauthorized("Invalid or missing token");
    }
  });
}

export default fp(authPlugin);
