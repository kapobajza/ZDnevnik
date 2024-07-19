import type { FastifyInstance } from "fastify";

import { UserModel } from "./users.model";

import { ModelORM } from "~/api/db/orm";

export default function users(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const usersModel = new ModelORM(
    UserModel,
    fastify.dbPool,
    fastify.mappedTable,
  );

  fastify.get("", async (_request, reply) => {
    const users = await usersModel
      .select({
        id: UserModel.fields.Id,
        firstName: UserModel.fields.FirstName,
        lastName: UserModel.fields.LastName,
      })
      .limit(10)
      .execute();

    return reply.send(users);
  });

  done();
}
