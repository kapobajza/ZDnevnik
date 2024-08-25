import fp from "fastify-plugin";

import { FastifyCustomProp } from "~/api/types";
import { mapTables } from "~/api/db/util";

export default fp(async (fastify) => {
  const mappedTables = await mapTables(fastify.dbPool);
  fastify.decorate(FastifyCustomProp.MappedTable, mappedTables);
});
