import type { FastifyInstance } from "fastify";

import { UserModel } from "~/api/db/models";
import { ModelORM } from "~/api/db/orm";

export default function users(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const usersModel = new ModelORM(UserModel, fastify.dbPool);

  fastify.get("", async (_request, reply) => {
    const users = await usersModel
      .select("id", "first_name", "last_name")
      .limit(10)
      .execute();

    return reply.send(users);
  });

  done();
}