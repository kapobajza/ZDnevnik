export const FastifyCustomProp = {
  DbPool: "dbPool",
  VerifyUserFromSession: "verifyUserFromSession",
  VerifyTeacherFromSession: "verifyTeacherFromSession",
  VerifyTeacherHasAccessToClass: "verifyTeacherHasAccessToClass",
  MappedTable: "mappedTable",
} as const;

export type MappedTable = Record<string, number>;
