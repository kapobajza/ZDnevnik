import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";

import { buildApp } from "~/api/app";

async function main() {
  const app = Fastify({
    logger: true,
  });

  const envs = app.getEnvs();

  const pool = new Pool({
    connectionString: envs.DATABASE_URL,
  });

  await app.register(fp(buildApp), {
    connectionString: envs.DATABASE_URL,
    pgPool: pool,
  });

  app.addHook("onClose", async () => {
    await pool.end();
  });

  app.listen({ port: 3000 }, function (err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  });
}

void main();
