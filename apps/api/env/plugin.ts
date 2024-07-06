import fastifyEnv from "@fastify/env";
import { fastify } from "~/api/instance";

export const registerEnvPlugin = () => {
  fastify.register(fastifyEnv, {
    dotenv: true,
  });
};
