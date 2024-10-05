import { UserModel, usersDefaultSelect } from "@zdnevnik/toolkit";
import type { FastifyInstance } from "fastify";
import invariant from "tiny-invariant";

import { createModelORM } from "~/api/db/util";
import { createUnauthorizedReply } from "~/api/error/replies";

export default function users(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.get(
    "/me",
    {
      preHandler: fastify.verifyUserFromSession,
    },
    async (request, reply) => {
      const userModel = createModelORM(UserModel, fastify);
      invariant(request.session.user, "User not found in session");

      const user = await userModel
        .select(usersDefaultSelect)
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
