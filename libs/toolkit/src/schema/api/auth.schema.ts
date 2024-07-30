import { z } from "zod";

export const loginBodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1).min(8),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
