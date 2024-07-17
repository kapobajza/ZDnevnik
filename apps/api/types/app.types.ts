export const FastifyCustomProp = {
  DbPool: "dbPool",
  VerifyUserFromSession: "verifyUserFromSession",
  VerifyTeacherFromSession: "verifyTeacherFromSession",
  MappedTable: "mappedTable",
} as const;

export type MappedTable = Record<string, string>;
