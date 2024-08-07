import type { CreateQueryOptions } from "@tanstack/svelte-query";

import { createQuery } from "./util";

import { api } from "$lib/api";

const USER_PREFIX = "user";

export const userQueryKey = {
  me: [USER_PREFIX, "me"],
} as const;

export const meQueryOptions = (fetchFn: typeof fetch = fetch) =>
  ({
    queryKey: userQueryKey.me,
    queryFn: () => api(fetchFn).user.me(),
  }) satisfies CreateQueryOptions;

export const createMeQueryCached = () =>
  createQuery({
    ...meQueryOptions(),
    staleTime: Infinity,
  });
