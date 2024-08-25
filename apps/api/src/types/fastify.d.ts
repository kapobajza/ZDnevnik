import type { FastifyAuthFunction } from "@fastify/auth";
import type { Pool } from "pg";

import type { FastifyCustomProp, MappedTable } from "./app.types";

import type { EnvRecord } from "~/api/env/util";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): EnvRecord;
    [FastifyCustomProp.DbPool]: Pool;
    [FastifyCustomProp.VerifyUserFromSession]: FastifyAuthFunction;
    [FastifyCustomProp.VerifyTeacherFromSession]: FastifyAuthFunction;
    [FastifyCustomProp.VerifyTeacherHasAccessToClass]: FastifyAuthFunction;
    [FastifyCustomProp.MappedTable]: MappedTable;
  }
}
