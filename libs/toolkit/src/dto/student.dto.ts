import { z } from "zod";

export const addStudentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  ordinalNumber: z.number(),
  avatarUrl: z.string().nullable().optional(),
});

export type AddStudentDTO = z.infer<typeof addStudentSchema>;
