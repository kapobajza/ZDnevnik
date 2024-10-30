import type { InferModelFields, ModelFieldsStartingMap } from "./types";
import { model } from "./util";

const InviteTokenModelField = {
  Id: {
    name: "id",
    type: "string",
  },
  Email: {
    name: "email",
    type: "string",
  },
  Token: {
    type: "string",
    name: "token",
  },
  TokenSalt: {
    type: "string",
    name: "token_salt",
  },
  ExpiresAt: {
    name: "expires_at",
    type: "number",
    category: "timestamp",
  },
  Status: {
    type: "string",
    name: "status",
  },
  ClassroomId: {
    type: "string",
    name: "classroom_id",
  },
} as const satisfies ModelFieldsStartingMap;

export const InviteTokenModel = model({
  name: "invite_tokens",
  fields: InviteTokenModelField,
});

export type InviteTokenModel = InferModelFields<typeof InviteTokenModel>;
