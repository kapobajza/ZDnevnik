import type { ErrorResponse } from "@zdnevnik/toolkit";
import { ErrorResponseCode } from "@zdnevnik/toolkit";

import { PUBLIC_API_URL } from "$env/static/public";

type ApiMethodAdditionalOptions = {
  queryParams?: Record<string, string | number | boolean>;
};

export type ApiMethodOptions = Omit<RequestInit, "method" | "body"> &
  ApiMethodAdditionalOptions;

export type CreateApiOptions = {
  routePrefix?: string;
  fetch: typeof fetch;
  sessionCookie?: string;
};

export type CreateInstanceOptions = Omit<CreateApiOptions, "routePrefix">;

export const createApi = ({
  routePrefix,
  fetch: fetchFn,
  sessionCookie,
}: CreateApiOptions) => {
  const constructRoute = (
    route: string,
    quryParams: Record<string, string | number | boolean> = {},
  ) => {
    const url = new URL(
      `${PUBLIC_API_URL}${routePrefix ? `/${routePrefix}` : ""}${route ? `/${route}` : ""}`,
    );

    for (const [key, value] of Object.entries(quryParams)) {
      url.searchParams.set(key, String(value));
    }

    return url.href;
  };

  const doFetch = async <TResponse = unknown>(
    route: string,
    options?: RequestInit & ApiMethodAdditionalOptions,
  ) => {
    let { body } = options ?? {};
    const headers = (options?.headers ?? {}) as Record<string, string>;

    if (headers?.["Content-Type"] === "application/json" && body) {
      body = JSON.stringify(body);
    }

    if (sessionCookie) {
      headers["Cookie"] = sessionCookie;
    }

    const res = await fetchFn(constructRoute(route, options?.queryParams), {
      credentials: "include",
      ...options,
      body,
      headers,
    });

    if (!res.ok) {
      let errorToThrow: ErrorResponse;

      try {
        errorToThrow = await (res.json() as Promise<ErrorResponse>);
      } catch {
        errorToThrow = {
          code: ErrorResponseCode.UNKNOWN,
        };
      }

      throw errorToThrow;
    }

    const data = (await res.json()) as TResponse;

    return {
      response: res,
      data,
    };
  };

  return {
    get: async <TResponse = unknown>(
      route: string,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        ...options,
        method: "GET",
      });
    },
    post: async <TResponse = unknown, TBody = unknown>(
      route: string,
      data: TBody,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        ...options,
        method: "POST",
        body: data as BodyInit,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });
    },
    put: async <TResponse = unknown, TBody = unknown>(
      route: string,
      data: TBody,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        ...options,
        method: "PUT",
        body: data as BodyInit,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });
    },
    delete: async <TResponse = unknown>(
      route: string,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        ...options,
        method: "DELETE",
      });
    },
  };
};
