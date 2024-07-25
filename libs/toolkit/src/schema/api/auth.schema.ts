import { z } from "zod";

export const loginBodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
