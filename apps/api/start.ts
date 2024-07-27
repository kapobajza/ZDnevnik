import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";

import { buildApp } from "~/api/app";
import { registerEnvPlugin } from "~/api/env/util";

async function main() {
  const app = Fastify({
    logger: true,
  });

  await registerEnvPlugin(app, {
    dotenv: true,
  });

  const envs = app.getEnvs();

  const pool = new Pool({
    connectionString: envs.DATABASE_URL,
  });

  await app.register(fp(buildApp), {
    env: envs,
    pgPool: pool,
  });

  app.addHook("onClose", async () => {
    await pool.end();
  });

  app.listen({ port: 5000 }, function (err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  });
}

void main();
