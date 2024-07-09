import Fastify from "fastify";
import { App } from "~/api/app";

void App(
  Fastify({
    logger: true,
  }),
);
