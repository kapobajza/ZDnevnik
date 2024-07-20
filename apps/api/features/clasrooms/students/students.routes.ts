import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { idParamSchema } from "~/api/types/validation.types";

export const autoPrefix = "/clasrooms/:id/students";

export default function clasroomStudents(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "",
    {
      schema: {
        params: idParamSchema,
      },
      preHandler: fastify.auth(
        [fastify.verifyUserFromSession, fastify.verifyTeacherFromSession],
        {
          relation: "and",
        },
      ),
    },
    async (_request, reply) => {
      return reply.send({ ok: true });
    },
  );

  done();
}
