import fp from "fastify-plugin";
import { Pool } from "pg";

import { FastifyCustomProp, type FastifyInstance } from "~/api/types";

export default fp((fastify, _opts, done) => {
  const fstfy = fastify as FastifyInstance;
  const env = fstfy.getEnvs();

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  fastify.decorate(FastifyCustomProp.DbPool, pool);

  fastify.addHook("onClose", async (fastify) => {
    const fstfy = fastify as FastifyInstance;
    await fstfy.dbPool.end();
  });

  done();
});
