import type { FastifyAuthFunction } from "@fastify/auth";
import type { Pool } from "pg";

import type { FastifyCustomProp, MappedTable } from "./app.types";

import type { ApiEnv } from "~/api/env/types";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): ApiEnv;
    [FastifyCustomProp.DbPool]: Pool;
    [FastifyCustomProp.VerifyUserFromSession]: FastifyAuthFunction;
    [FastifyCustomProp.VerifyTeacherFromSession]: FastifyAuthFunction;
    [FastifyCustomProp.VerifyTeacherHasAccessToClass]: FastifyAuthFunction;
    [FastifyCustomProp.MappedTable]: MappedTable;
  }
}
