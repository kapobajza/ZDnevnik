import fp from "fastify-plugin";
import type { Pool } from "pg";

import { FastifyCustomProp } from "~/api/types";

export default fp<{ pool: Pool }>((fastify, opts, done) => {
  fastify.decorate(FastifyCustomProp.DbPool, opts.pool);

  done();
});
