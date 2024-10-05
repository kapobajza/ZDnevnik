import { z } from "zod";

export const FastifyCustomProp = {
  DbPool: "dbPool",
  VerifyUserFromSession: "verifyUserFromSession",
  VerifyTeacherFromSession: "verifyTeacherFromSession",
  VerifyTeacherHasAccessToClass: "verifyTeacherHasAccessToClass",
  MappedTable: "mappedTable",
  Service: "service",
} as const;

export type MappedTable = Record<string, number>;

export const appEnvArgSchema = z.union([
  z.literal("local"),
  z.literal("dev"),
  z.literal("prod"),
]);

export type AppEnv = z.infer<typeof appEnvArgSchema>;
