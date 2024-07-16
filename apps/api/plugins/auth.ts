import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";

import { FastifyCustomProp } from "~/api/types";
import {
  HttpErrorCode,
  type HttpError,
  HttpErrorStatus,
} from "~/api/error/types";
import { UserRole } from "~/api/features/users/user.types";

export default fp((fastify, _opts, done) => {
  fastify.decorate(
    FastifyCustomProp.VerifyUserFromSession,
    (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
      if (!request.session?.user) {
        const error: HttpError = {
          code: HttpErrorCode.Unathorized,
          message: "Unauthorized",
          statusCode: HttpErrorStatus.Unauthorized,
        };
        return reply.code(error.statusCode).send(error);
      }

      return done();
    },
  );

  fastify.decorate(
    FastifyCustomProp.VerifyTeacherFromSession,
    (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
      const { user } = request.session;

      if (user && user.role !== UserRole.Teacher) {
        const error: HttpError = {
          code: HttpErrorCode.Forbidden,
          message: "Forbidden",
          statusCode: HttpErrorStatus.Forbidden,
        };
        return reply.code(error.statusCode).send(error);
      }

      return done();
    },
  );

  done();
});
