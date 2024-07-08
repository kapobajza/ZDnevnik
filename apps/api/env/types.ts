import type { ObjectValues } from "@zdnevnik/toolkit";

export const ApiEnvEnum = {
  DATABASE_URL: "DATABASE_URL",
} as const;

export type ApiEnv = ObjectValues<typeof ApiEnvEnum>;
