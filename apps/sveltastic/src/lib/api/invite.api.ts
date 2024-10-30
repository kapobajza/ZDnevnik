import type { InviteResponseBody, InviteStudentBody } from "@zdnevnik/toolkit";

import type { CreateInstanceOptions } from "./api";
import { createApi } from "./api";

export const createInviteApi = (options: CreateInstanceOptions) => {
  const inviteApi = createApi({
    ...options,
    routePrefix: "invite",
  });

  return {
    respond(token: string, params: InviteResponseBody) {
      return inviteApi.post(`${token}/respond`, params);
    },
    student(classroomId: string, body: InviteStudentBody) {
      return inviteApi.post(`${classroomId}/student`, body);
    },
  };
};

export type InviteApi = ReturnType<typeof createInviteApi>;
