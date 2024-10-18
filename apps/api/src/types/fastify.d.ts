import type { FastifyAuthFunction } from "@fastify/auth";
import type { Pool } from "pg";

import type { FastifyCustomProp, MappedTable } from "./app.types";

import type { EnvRecord } from "~/api/env/util";
import type { ClassroomService } from "~/api/features/classrooms/classrooms.service";
import type { EmailClient } from "~/api/email/client";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): EnvRecord;
    [FastifyCustomProp.DbPool]: Pool;
    [FastifyCustomProp.VerifyUserFromSession]: FastifyAuthFunction;
    [FastifyCustomProp.VerifyTeacherFromSession]: FastifyAuthFunction;
    [FastifyCustomProp.VerifyTeacherHasAccessToClass]: (
      idField?: string,
    ) => FastifyAuthFunction;
    [FastifyCustomProp.MappedTable]: MappedTable;
    [FastifyCustomProp.Service]: {
      classroom: ClassroomService;
    };
    [FastifyCustomProp.EmailClient]: EmailClient;
  }
}
