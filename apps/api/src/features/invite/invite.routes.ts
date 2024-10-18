import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  addStudentBodySchema,
  inviteRespondBodySchema,
  InviteTokenModel,
  UserClasroomModel,
  UserModel,
  UserRole,
} from "@zdnevnik/toolkit";
import * as DateFns from "date-fns";
import { z } from "zod";

import { InviteErrorCode } from "~/api/features/invite//invite.util";
import { InviteTokenStatus } from "~/api/features/invite/invite.types";
import { okResponseSchema } from "~/api/types/validation.types";
import { createModelORM } from "~/api/db/util";
import { generateSecureString, securelyHashString } from "~/api/util/secure";
import { timestampGeneralFormat } from "~/api/util/date_time";
import { generateUdid } from "~/api/util/udid";
import { renderInviteStudentTemplate } from "~/api/email/templates/render";
import { ModelORM } from "~/api/db/orm";
import {
  createErrorReply,
  createNotFoundReply,
  createOkReply,
} from "~/api/error/replies";

export default function invite(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/:classroomId/student",
    {
      schema: {
        body: addStudentBodySchema,
        response: {
          200: okResponseSchema,
        },
        params: z.object({
          classroomId: z.string().min(1),
        }),
      },
      preHandler: fastify.verifyTeacherHasAccessToClass("classroomId"),
    },
    async (request, reply) => {
      const { email } = request.body;
      const env = fastify.getEnvs();
      const inviteTokenSalt = generateSecureString(20);
      const inviteToken = generateSecureString();
      const hashedToken = securelyHashString(inviteToken, inviteTokenSalt);
      const expiresAt = timestampGeneralFormat(DateFns.addDays(new Date(), 1));
      const inviteTokenModel = createModelORM(InviteTokenModel, fastify);

      await inviteTokenModel.transaction(async (tx, client) => {
        await tx
          .insert([
            ["Id", generateUdid()],
            ["Email", email],
            ["Status", InviteTokenStatus.Pending],
            ["ExpiresAt", expiresAt],
            ["Token", hashedToken],
            ["TokenSalt", inviteTokenSalt],
            ["ClassroomId", request.params.classroomId],
          ])
          .execute(client);

        const inviteStudentTemplate = await renderInviteStudentTemplate({
          inviteUrl: `${env.WEB_APP_URL}/invite?token=${inviteToken}`,
        });

        await fastify.emailClient.send({
          from: "ZDnevnik Invite <invite@zdnevnik.com>",
          to: [email],
          subject: "Dobrodošli na ZDnevnik!",
          html: inviteStudentTemplate,
        });
      });

      return createOkReply(reply);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/:token/respond",
    {
      schema: {
        params: z.object({
          token: z.string().min(1),
        }),
        body: inviteRespondBodySchema,
        response: {
          200: okResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const inviteTokenModel = new ModelORM(
        InviteTokenModel,
        fastify.dbPool,
        fastify.mappedTable,
      );
      const { email, firstName, lastName, password, avatarUrl } = request.body;

      const inviteToken = await inviteTokenModel
        .select({
          email: InviteTokenModel.fields.Email,
          token: InviteTokenModel.fields.Token,
          status: InviteTokenModel.fields.Status,
          expiresAt: InviteTokenModel.fields.ExpiresAt,
          salt: InviteTokenModel.fields.TokenSalt,
          classroomId: InviteTokenModel.fields.ClassroomId,
        })
        .where({
          field: InviteTokenModel.fields.Email,
          operator: "=",
          value: email,
        })
        .and({
          field: InviteTokenModel.fields.Status,
          operator: "=",
          value: InviteTokenStatus.Pending,
        })
        .executeOne();

      if (!inviteToken) {
        return createNotFoundReply(reply);
      }

      if (inviteToken.status !== InviteTokenStatus.Pending) {
        return createErrorReply(reply, InviteErrorCode.TokenAlreadyUsed, 400);
      }

      if (DateFns.isAfter(inviteToken.expiresAt, new Date())) {
        await inviteTokenModel
          .update([["Status", InviteTokenStatus.Expired]])
          .execute();
        return createErrorReply(reply, InviteErrorCode.TokenExpired, 400);
      }

      const hashedToken = securelyHashString(
        request.params.token,
        inviteToken.salt,
      );

      if (hashedToken !== inviteToken.token) {
        return createNotFoundReply(reply);
      }

      const userModel = new ModelORM(
        UserModel,
        fastify.dbPool,
        fastify.mappedTable,
      );

      const passwordSalt = generateSecureString();
      const passwordHash = securelyHashString(password, passwordSalt);

      const latestStudent = await userModel
        .select({
          ordinalNumber: UserModel.fields.OrdinalNumber,
        })
        .join({
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
          table: UserClasroomModel,
        })
        .where({
          field: UserClasroomModel.fields.ClassroomId,
          operator: "=",
          value: inviteToken.classroomId,
        })
        .and({
          field: UserModel.fields.Role,
          operator: "=",
          value: UserRole.Student,
        })
        .sort({
          by: [UserModel.fields.OrdinalNumber],
          order: "DESC",
        })
        .executeOne();

      const { ordinalNumber = 0 } = latestStudent ?? {};

      await userModel
        .insert([
          ["FirstName", firstName],
          ["LastName", lastName],
          ["OrdinalNumber", ordinalNumber + 1],
          ["Role", UserRole.Student],
          ["AverageGrade", 0.0],
          ["Avatar", avatarUrl],
          ["PasswordHash", passwordHash],
          ["PasswordSalt", passwordSalt],
          ["Id", generateUdid()],
          ["Username", email],
        ])
        .executeOne();
      await inviteTokenModel
        .update([["Status", InviteTokenStatus.Accepted]])
        .execute();

      return createOkReply(reply);
    },
  );

  done();
}
