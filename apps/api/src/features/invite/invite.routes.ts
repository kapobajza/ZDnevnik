import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { addStudentBodySchema, InviteTokenModel } from "@zdnevnik/toolkit";
import * as DateFns from "date-fns";

import { InviteTokenStatus } from "~/api/features/invite/invite.types";
import { okResponseSchema } from "~/api/types/validation.types";
import { createModelORM } from "~/api/db/util";
import { generateSecureString, securelyHashString } from "~/api/util/secure";
import { timestampGeneralFormat } from "~/api/util/date_time";
import { generateUdid } from "~/api/util/udid";
import { renderInviteStudentTemplate } from "~/api/email/templates/render";

export default function clasrooms(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/student",
    {
      schema: {
        body: addStudentBodySchema,
        response: {
          200: okResponseSchema,
        },
      },
      preHandler: fastify.verifyTeacherFromSession,
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

      return reply.send({
        ok: true,
      });
    },
  );

  done();
}
