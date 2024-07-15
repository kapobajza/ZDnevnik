import { z } from "zod";

export const apiEnvSchema = z.object({
  DATABASE_URL: z.literal("DATABASE_URL"),
  COOKIE_NAME: z.literal("COOKIE_NAME"),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export const ApiEnv = {
  DATABASE_URL: "DATABASE_URL",
  COOKIE_NAME: "COOKIE_NAME",
} as const satisfies ApiEnv;

export type EnvRecord = Record<keyof ApiEnv, string>;
