import { z } from "zod";

export const apiEnvSchema = z.object({
  DATABASE_URL: z.string(),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export const ApiEnv = {
  DATABASE_URL: "DATABASE_URL",
} as const satisfies ApiEnv;
