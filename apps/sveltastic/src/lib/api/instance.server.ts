import type { ApiFn } from "./instance";
import { api } from "./instance";

import { SESSION_COOKIE_NAME } from "$env/static/private";

export const serverApi: ApiFn = (options) => {
  if (!options) {
    return api();
  }

  return api({
    ...options,
    sessionCookie: options?.sessionCookie
      ? `${SESSION_COOKIE_NAME}=${encodeURIComponent(options.sessionCookie)}`
      : undefined,
  });
};
