import { UserModel, usersMeSelect } from "@zdnevnik/toolkit";
import type { FastifyInstance } from "fastify";
import invariant from "tiny-invariant";

import { ModelORM } from "~/api/db/orm";
import { createUnauthorizedReply } from "~/api/error/replies";

export default function users(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const userModel = new ModelORM(
    UserModel,
    fastify.dbPool,
    fastify.mappedTable,
  );

  fastify.get(
    "/me",
    {
      preHandler: fastify.auth([fastify.verifyUserFromSession]),
    },
    async (request, reply) => {
      invariant(request.session.user, "User not found in session");

      const user = await userModel
        .select(usersMeSelect)
        .where({
          field: UserModel.fields.Id,
          operator: "=",
          value: request.session.user.id,
        })
        .executeOne();

      if (!user) {
        return createUnauthorizedReply(reply);
      }

      return reply.send({ user });
    },
  );

  done();
}
