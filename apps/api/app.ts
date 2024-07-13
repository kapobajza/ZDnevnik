import Env from "@fastify/env";
import Postgres from "@fastify/postgres";
import { ApiEnv } from "~/api/env/types";
import AutoLoad from "@fastify/autoload";
import path from "path";
import PrintRoutes from "fastify-print-routes";
import type { FastifyInstance } from "./types";

export async function App(fastify: FastifyInstance) {
  await fastify.register(Env, {
    dotenv: true,
    schema: {
      type: "object",
      required: [ApiEnv.DATABASE_URL],
      properties: {
        [ApiEnv.DATABASE_URL]: {
          type: "string",
        },
      },
    },
  });

  const env = fastify.getEnvs();

  await fastify.register(Postgres, {
    connectionString: env.DATABASE_URL,
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
  });

  await fastify.register(PrintRoutes);

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "features"),
    matchFilter: (path) => {
      return path.endsWith(".routes.ts");
    },
    ignoreFilter(path) {
      return path.endsWith("test.routes.ts");
    },
    maxDepth: 1,
  });

  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  });
}
