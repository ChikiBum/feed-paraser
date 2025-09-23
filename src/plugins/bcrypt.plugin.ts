import fastifyBcrypt from "fastify-bcrypt";
import fp from "fastify-plugin";

const pluginName = "bcrypt-plugin";

export default fp(
  async (fastify) => {
    fastify.register(fastifyBcrypt, { saltWorkFactor: 10 });
    fastify.pluginLoaded(pluginName);
  },
  {
    name: pluginName,
  },
);