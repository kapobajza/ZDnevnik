import fp from "fastify-plugin";
import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { UserClasroomModel, UserModel, UserRole } from "@zdnevnik/toolkit";

import { createModelORM } from "~/api/db/util";
import { FastifyCustomProp } from "~/api/types";
import {
  createForbiddenReply,
  createNotFoundReply,
  createUnauthorizedReply,
} from "~/api/error/replies";

export default fp((fastify, _opts, done) => {
  type FastifyAuthParams = Parameters<typeof fastify.auth>;

  const fastifyAuth = () => {
    return fastify.auth.bind(fastify) as (...args: FastifyAuthParams) => {
      (
        request: FastifyRequest,
        reply: FastifyReply,
        done: HookHandlerDoneFunction,
      ): void;
    };
  };

  const isUserAuthenticated = (request: FastifyRequest) => {
    const sessionOptions = request.session.get("options");
    const user = request.session.get("user");

    if (!user || !sessionOptions) {
      return false;
    }

    const now = Date.now();
    const { sessionCookieMaxAge } = sessionOptions;

    if (!(now > sessionCookieMaxAge)) {
      return true;
    }

    return false;
  };

  const isUserTeacher = (request: FastifyRequest) => {
    const { user } = request.session;

    if (user && user.role !== UserRole.Teacher) {
      return false;
    }

    return true;
  };

  const verifyUserFromSession = (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => {
    if (isUserAuthenticated(request)) {
      return done();
    }

    request.session.delete();
    return createUnauthorizedReply(reply);
  };

  const verifyTeacherFromSession = (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => {
    if (isUserTeacher(request)) {
      return done();
    }

    return createForbiddenReply(reply);
  };

  const verifyTeacherHasAccessToClass =
    (idField = "id") =>
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!isUserAuthenticated(request)) {
        return createUnauthorizedReply(reply);
      }

      if (!isUserTeacher(request)) {
        return createForbiddenReply(reply);
      }

      const { user } = request.session;
      const userClasroomTable = createModelORM(UserClasroomModel, fastify);

      if (!user) {
        return createUnauthorizedReply(reply);
      }

      const params = request.params as Record<string, string>;
      const idParamValue = params?.[idField];

      if (!idParamValue) {
        return createUnauthorizedReply(reply);
      }

      try {
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
            value: idParamValue,
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
          return createNotFoundReply(reply);
        }
      } catch {
        return createForbiddenReply(reply);
      }
    };

  fastify.decorate(
    FastifyCustomProp.VerifyUserFromSession,
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      const auth = fastifyAuth();
      return auth([verifyUserFromSession])(request, reply, done);
    },
  );

  fastify.decorate(
    FastifyCustomProp.VerifyTeacherFromSession,
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      const auth = fastifyAuth();
      return auth([verifyUserFromSession, verifyTeacherFromSession], {
        relation: "and",
      })(request, reply, done);
    },
  );

  fastify.decorate(
    FastifyCustomProp.VerifyTeacherHasAccessToClass,
    (idField?: string) =>
      (
        request: FastifyRequest,
        reply: FastifyReply,
        done: HookHandlerDoneFunction,
      ) => {
        const auth = fastifyAuth();
        return auth([verifyTeacherHasAccessToClass(idField)])(
          request,
          reply,
          done,
        );
      },
  );

  done();
});
