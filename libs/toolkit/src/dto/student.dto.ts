import { z } from "zod";

import { AcceptableImageType, MAX_IMAGE_SIZE } from "~/toolkit/dto/image.dto";
import { ZodCustomIssue } from "~/toolkit/util/zod";

export const addStudentBodySchemaCommon = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  ordinalNumber: z.number().min(1).max(50),
});

export const addStudentBodySchema = addStudentBodySchemaCommon.extend({
  avatarUrl: z.string().optional().nullable(),
});

export type AddStudentBody = z.infer<typeof addStudentBodySchema>;

const acceptableImageTypes = Object.values(AcceptableImageType) as string[];

export const addStudentWithFileBodySchema = addStudentBodySchemaCommon.extend({
  avatar: z
    .instanceof(File)
    .superRefine((file, ctx) => {
      if (file?.size > MAX_IMAGE_SIZE) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            code: ZodCustomIssue.FileTooBig,
          },
        });
      }

      if (!acceptableImageTypes.includes(file.type)) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            code: ZodCustomIssue.FileNotImage,
          },
        });
      }
    })
    .optional()
    .nullable(),
});

export type AddStudentWithFileBody = z.infer<
  typeof addStudentWithFileBodySchema
>;
