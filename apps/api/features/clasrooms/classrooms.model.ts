import { model } from "~/api/db/util";
import type { InferModelFields } from "~/api/db/types";

export const ClassroomModel = model({
  name: "classrooms",
  fields: {
    Id: {
      name: "id",
      type: "string",
    },
    Name: {
      name: "name",
      type: "string",
      length: 255,
    },
  },
} as const);

export type ClassroomModel = InferModelFields<typeof ClassroomModel>;
