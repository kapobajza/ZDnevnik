import { z } from "zod";

import { ZodCustomIssue } from "~/toolkit/util/zod";

export const inviteBodyCommonFields = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
});

export const inviteRespondBodySchema = inviteBodyCommonFields.extend({
  email: z.string().min(1),
});

export type InviteResponseBody = z.infer<typeof inviteRespondBodySchema>;

export const inviteRespondClientBodySchema = inviteBodyCommonFields
  .extend({
    confirmPassword: z.string().min(1),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: ZodCustomIssue.PasswordsDoNotMatch,
        path: ["confirmPassword"],
        params: {
          code: ZodCustomIssue.PasswordsDoNotMatch,
        },
      });
    }
  });

export type InviteResponseClientBody = z.infer<
  typeof inviteRespondClientBodySchema
>;

export const inviteStudentBodySchema = z.object({
  email: z.string().min(1),
});

export type InviteStudentBody = z.infer<typeof inviteStudentBodySchema>;

export const inviteStudentClientBodySchema = inviteStudentBodySchema.extend({
  classroomId: z.string().min(1),
});

export type InviteStudentClientBody = z.infer<
  typeof inviteStudentClientBodySchema
>;
