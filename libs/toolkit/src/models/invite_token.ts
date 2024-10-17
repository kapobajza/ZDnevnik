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
  ExpiresAt: {
    name: "expires_at",
    type: "number",
    category: "timestamp",
  },
  Status: {
    type: "string",
    name: "status",
  },
} as const satisfies ModelFieldsStartingMap;

export const InviteTokenModel = model({
  name: "invite_tokens",
  fields: InviteTokenModelField,
});

export type InviteTokenModel = InferModelFields<typeof InviteTokenModel>;
