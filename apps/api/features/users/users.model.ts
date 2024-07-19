import type { InferModelFields } from "~/api/db/types";
import { model } from "~/api/db/util";

export const UserModel = model({
  name: "users",
  fields: {
    Id: {
      name: "id",
      type: "string",
    },
    FirstName: {
      name: "first_name",
      type: "string",
      length: 255,
    },
    LastName: {
      name: "last_name",
      type: "string",
      length: 255,
    },
    Username: {
      name: "username",
      type: "string",
      length: 255,
    },
    PasswordHash: {
      name: "password_hash",
      type: "string",
    },
    PasswordSalt: {
      name: "password_salt",
      type: "string",
    },
    Avatar: {
      name: "avatar",
      type: "string",
    },
    Role: {
      name: "role",
      type: "string",
      length: 255,
    },
    OrdinalNumber: {
      name: "ordinal_number",
      type: "number",
      category: "integer",
    },
    AverageGrade: {
      name: "average_grade",
      type: "number",
      category: "decimal",
    },
  },
});

export type UserModel = InferModelFields<typeof UserModel>;
