import { z } from "zod";

export const inviteRespondBodySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
  avatarUrl: z.string().optional().nullable(),
  email: z.string().min(1),
});

export type InviteResponseBody = z.infer<typeof inviteRespondBodySchema>;
