import { createErrorResponseSchema, loginBodySchema } from "@zdnevnik/toolkit";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { hashPassword } from "./util";
import { LoginSelectedUserDTO } from "./types";
import { getCookieExpiry } from "./util/session";

import { UserModel } from "~/api/features/users/users.model";
import { ModelORM } from "~/api/db/orm";

export default function auth(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const usersModel = new ModelORM(
    UserModel,
    fastify.dbPool,
    fastify.mappedTable,
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: loginBodySchema,
        response: {
          400: createErrorResponseSchema("invalid_credentials"),
          200: z.object({ ok: z.literal(true) }),
        },
      },
    },
    async (request, reply) => {
      const user = await usersModel
        .select(LoginSelectedUserDTO)
        .where({
          field: UserModel.fields.Username,
          operator: "=",
          value: request.body.username,
        })
        .executeOne();

      if (!user) {
        return reply.code(400).send({ error: "invalid_credentials" });
      }

      const dbPasswordHash = hashPassword(
        request.body.password,
        user.passwordSalt,
      );

      if (dbPasswordHash !== user.passwordHash) {
        return reply.code(400).send({ error: "invalid_credentials" });
      }

      const { ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } =
        fastify.getEnvs();

      request.session.set("user", user);
      request.session.set("options", {
        accessCookieMaxAge: getCookieExpiry(ACCESS_COOKIE_MAX_AGE),
        refreshCookieMaxAge: getCookieExpiry(REFRESH_COOKIE_MAX_AGE),
      });

      return reply.send({ ok: true });
    },
  );

  done();
}
