import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";

import { getCookieExpiry } from "../features/auth/util/session";

import { UserClasroomModel } from "~/api/db/models";
import { UserModel } from "~/api/features/users/users.model";
import { FastifyCustomProp } from "~/api/types";
import { UserRole } from "~/api/features/users/user.types";
import { ModelORM } from "~/api/db/orm";
import type { IdParam } from "~/api/types/validation.types";
import {
  createForbiddenReply,
  createUnauthorizedReply,
} from "~/api/error/replies";

export default fp((fastify, _opts, done) => {
  fastify.decorate(
    FastifyCustomProp.VerifyUserFromSession,
    (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
      const sessionOptions = request.session.get("options");

      if (!request.session?.user || !sessionOptions) {
        return createUnauthorizedReply(reply);
      }

      const now = Date.now();
      const { accessCookieMaxAge, refreshCookieMaxAge } = sessionOptions;

      if (!(now > accessCookieMaxAge)) {
        return done();
      }

      if (now < refreshCookieMaxAge) {
        const { ACCESS_COOKIE_MAX_AGE } = fastify.getEnvs();
        const newExpiry = getCookieExpiry(ACCESS_COOKIE_MAX_AGE);
        request.session.set("options", {
          ...sessionOptions,
          accessCookieMaxAge: newExpiry,
        });
        return done();
      }

      request.session.delete();
      return reply.redirect("/login");
    },
  );

  fastify.decorate(
    FastifyCustomProp.VerifyTeacherFromSession,
    (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
      const { user } = request.session;

      if (user && user.role !== UserRole.Teacher) {
        return createForbiddenReply(reply);
      }

      return done();
    },
  );

  fastify.decorate(
    FastifyCustomProp.VerifyTeacherHasAccessToClass,
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { user } = request.session;
      const userClasroomTable = new ModelORM(
        UserClasroomModel,
        fastify.dbPool,
        fastify.mappedTable,
      );

      if (!user) {
        return createUnauthorizedReply(reply);
      }

      if (user.role !== UserRole.Teacher) {
        return createForbiddenReply(reply);
      }

      const params = request.params as IdParam;

      const result = await userClasroomTable
        .select({
          teacherId: UserClasroomModel.fields.UserId,
        })
        .join({
          table: UserModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .where({
          field: UserClasroomModel.fields.ClassroomId,
          operator: "=",
          value: params.id,
        })
        .and({
          field: UserModel.fields.Role,
          operator: "=",
          value: UserRole.Teacher,
        })
        .and({
          field: UserModel.fields.Id,
          operator: "=",
          value: user.id,
        })
        .executeOne();

      if (!result) {
        return createForbiddenReply(reply);
      }
    },
  );

  done();
});
