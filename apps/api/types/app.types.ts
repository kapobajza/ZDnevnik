export const FastifyCustomProp = {
  DbPool: "dbPool",
} as const;

// export type FastifyInstance = Omit<FastifyDefaultInstance, "getEnvs"> & {
//   getEnvs: () => ApiEnv;
//   [FastifyCustomProp.DbPool]: PgPool;
// };
