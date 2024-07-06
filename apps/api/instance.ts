import Fastify from "fastify";
import { registerEnvPlugin } from "~/api/env/plugin";
import { registerDbPlugin } from "~/api/db/plugin";

registerEnvPlugin();
registerDbPlugin();

export const fastify = Fastify({
  logger: true,
});
