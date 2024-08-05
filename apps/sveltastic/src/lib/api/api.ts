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
  fetchFn: typeof fetch;
};

export const createApi = ({ routePrefix, fetchFn }: CreateApiOptions) => {
  const constructRoute = (
    route: string,
    quryParams: Record<string, string | number | boolean> = {},
  ) => {
    const url = new URL(
      `${PUBLIC_API_URL}${routePrefix ? `/${routePrefix}` : ""}/${route}`,
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
    const res = await fetchFn(constructRoute(route, options?.queryParams), {
      credentials: "include",
      ...options,
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
    post: async <TResponse = unknown, TPostBody = unknown>(
      route: string,
      data: TPostBody,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          ...options?.headers,
          "Content-Type": "application/json",
        },
      });
    },
    put: async <TResponse = unknown, TPutBody = unknown>(
      route: string,
      data: TPutBody,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          ...options?.headers,
          "Content-Type": "application/json",
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
