import Env from "@fastify/env";
import Postgres from "@fastify/postgres";
import type { FastifyInstance } from "fastify";
import { ApiEnvEnum } from "~/api/env/types";
import AutoLoad from "@fastify/autoload";
import path from "path";

export async function App(fastify: FastifyInstance) {
  await fastify.register(Env, {
    dotenv: true,
    schema: {
      type: "object",
      required: [ApiEnvEnum.DATABASE_URL],
      properties: {
        [ApiEnvEnum.DATABASE_URL]: {
          type: "string",
        },
      },
    },
  });

  const env = fastify.getEnvs<typeof ApiEnvEnum>();

  await fastify.register(Postgres, {
    connectionString: env.DATABASE_URL,
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    matchFilter: (path) => {
      return path.endsWith(".routes.ts");
    },
  });

  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  });
}
