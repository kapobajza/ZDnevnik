import type { ErrorResponse } from "@zdnevnik/toolkit";
import { ErrorResponseCode } from "@zdnevnik/toolkit";

export type ApiMethodOptions = Omit<RequestInit, "method" | "body">;

export type CreateApiOptions = {
  baseUrl: string;
};

export const createApi = ({
  baseUrl,
  routePrefix,
}: {
  routePrefix?: string;
} & CreateApiOptions) => {
  const constructRoute = (route: string) => {
    return `${baseUrl}${routePrefix ? `/${routePrefix}` : ""}/${route}`;
  };

  const doFetch = async <TResponse = unknown>(
    route: string,
    options?: RequestInit,
  ) => {
    const res = await fetch(constructRoute(route), {
      ...options,
    });

    if (!res.ok) {
      let errorToThrow: ErrorResponse;

      try {
        const errorResponse = await (res.json() as Promise<ErrorResponse>);
        errorToThrow = errorResponse;
      } catch {
        errorToThrow = {
          code: ErrorResponseCode.UNKNOWN,
        };
      }

      throw errorToThrow;
    }

    return res.json() as Promise<TResponse>;
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
        method: "POST",
        body: JSON.stringify(data),
        ...options,
        headers: {
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
        method: "PUT",
        body: JSON.stringify(data),
        ...options,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    delete: async <TResponse = unknown>(
      route: string,
      options?: ApiMethodOptions,
    ) => {
      return doFetch<TResponse>(route, {
        method: "DELETE",
        ...options,
      });
    },
  };
};
