import {
  UserModel,
  errorResponseSchema,
  loginBodySchema,
} from "@zdnevnik/toolkit";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { LoginSelectedUserDTO } from "./types";
import { getCookieExpiry } from "./util/session";

import { createModelORM } from "~/api/db/util";
import { okResponseSchema } from "~/api/types/validation.types";
import { securelyHashString } from "~/api/util/secure";

export default function auth(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: loginBodySchema,
        response: {
          400: errorResponseSchema,
          200: okResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const usersModel = createModelORM(UserModel, fastify);

      const user = await usersModel
        .select(LoginSelectedUserDTO)
        .where({
          field: UserModel.fields.Username,
          operator: "=",
          value: request.body.username,
        })
        .executeOne();

      if (!user) {
        return reply.code(400).send({ code: "invalid_credentials" });
      }

      const dbPasswordHash = securelyHashString(
        request.body.password,
        user.passwordSalt,
      );

      if (dbPasswordHash !== user.passwordHash) {
        return reply.code(400).send({ code: "invalid_credentials" });
      }

      const { SESSION_COOKIE_MAX_AGE } = fastify.getEnvs();

      request.session.set("user", user);
      request.session.set("options", {
        sessionCookieMaxAge: getCookieExpiry(SESSION_COOKIE_MAX_AGE),
      });

      return reply.send({ ok: true });
    },
  );

  done();
}
