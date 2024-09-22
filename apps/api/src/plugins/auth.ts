import fp from "fastify-plugin";
import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { UserClasroomModel, UserModel, UserRole } from "@zdnevnik/toolkit";

import { FastifyCustomProp } from "~/api/types";
import { ModelORM } from "~/api/db/orm";
import type { IdParam } from "~/api/types/validation.types";
import {
  createForbiddenReply,
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

  const verifyUserFromSession = (
    request: FastifyRequest,
    reply: FastifyReply,
    done: () => void,
  ) => {
    const sessionOptions = request.session.get("options");
    const user = request.session.get("user");

    if (!user || !sessionOptions) {
      return createUnauthorizedReply(reply);
    }

    const now = Date.now();
    const { sessionCookieMaxAge } = sessionOptions;

    if (!(now > sessionCookieMaxAge)) {
      return done();
    }

    request.session.delete();
    return createUnauthorizedReply(reply);
  };

  const verifyTeacherFromSession = (
    request: FastifyRequest,
    reply: FastifyReply,
    done: () => void,
  ) => {
    const { user } = request.session;

    if (user && user.role !== UserRole.Teacher) {
      return createForbiddenReply(reply);
    }

    return done();
  };

  const verifyTeacherHasAccessToClass = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const { user } = request.session;
    const userClasroomTable = new ModelORM(
      UserClasroomModel,
      fastify.dbPool,
      fastify.mappedTable,
    );

    if (!user) {
      return createUnauthorizedReply(reply);
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
    (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
      const auth = fastifyAuth();
      return auth([verifyUserFromSession, verifyTeacherFromSession], {
        relation: "and",
      })(request, reply, done);
    },
  );

  fastify.decorate(
    FastifyCustomProp.VerifyTeacherHasAccessToClass,
    async (request: FastifyRequest, reply: FastifyReply) => {
      const auth = fastifyAuth();
      return auth(
        [
          verifyUserFromSession,
          verifyTeacherFromSession,
          verifyTeacherHasAccessToClass,
        ],
        {
          relation: "and",
        },
      )(request, reply, done);
    },
  );

  done();
});
