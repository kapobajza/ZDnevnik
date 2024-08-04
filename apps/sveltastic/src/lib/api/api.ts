import type { ErrorResponse } from "@zdnevnik/toolkit";
import { ErrorResponseCode } from "@zdnevnik/toolkit";

export type ApiMethodOptions = Omit<RequestInit, "method" | "body">;

export type CreateApiOptions = {
  baseUrl: string;
  origin: string;
  responseInterceptor?: (response: Response) => void;
};

export const createApi = ({
  baseUrl,
  routePrefix,
  origin,
  responseInterceptor,
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
      credentials: "include",
      ...options,
      headers: {
        ...options?.headers,
        Origin: origin,
      },
    });

    responseInterceptor?.(res);

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
