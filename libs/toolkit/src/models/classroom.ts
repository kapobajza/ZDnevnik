import type { InferModelFields } from "./types";
import { model } from "./util";

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
