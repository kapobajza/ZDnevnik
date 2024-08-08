import type {
  CreateInfiniteQueryOptions as TSCreateInfiniteQueryOptions,
  DefaultError,
  InfiniteData,
  QueryClient,
  QueryKey,
  StoreOrVal,
  InfiniteQueryObserverResult as TSQInfiniteQueryObserverResult,
  QueryFunctionContext,
} from "@tanstack/svelte-query";
import { createInfiniteQuery as createInfiniteTSQuery } from "@tanstack/svelte-query";
import { derived, type Readable } from "svelte/store";

import type { AdditionalQueryResult } from "./types";

export type InfiniteQueryObserverResult<TData, TError> =
  TSQInfiniteQueryObserverResult<TData, TError> & AdditionalQueryResult;

export type CreateInfiniteQueryResult<TData, TError> = Readable<
  InfiniteQueryObserverResult<TData, TError>
>;

export type InfiniteQueryFunctionContext<
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> = QueryFunctionContext<TQueryKey, TPageParam> & {
  page: number;
  limit: number;
};

export type InfiniteQueryFunction<TQueryData = unknown> = (
  context: InfiniteQueryFunctionContext,
) => Promise<TQueryData>;

export type CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = Omit<
  TSCreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey,
    TPageParam
  >,
  "queryFn" | "getNextPageParam" | "initialPageParam"
> & {
  queryFn: InfiniteQueryFunction<TQueryFnData>;
  limit?: number;
};

const isResponseEmpty = <TData extends Array<unknown>>(
  data: InfiniteData<TData>,
) => {
  return data?.pages?.[0]?.length === 0;
};

const DEFAULT_LIMIT = 10;

export function createInfiniteQuery<
  TQueryFnData extends Array<unknown>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: StoreOrVal<
    CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      number
    >
  >,
  queryClient?: QueryClient,
): CreateInfiniteQueryResult<TData, TError> {
  const opts = options as CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    number
  >;
  const { limit = DEFAULT_LIMIT, ...otherOptions } = opts;

  const response = createInfiniteTSQuery(
    {
      ...otherOptions,
      queryFn: (context) => {
        return opts.queryFn({
          ...context,
          limit,
          page: context.pageParam,
        });
      },
      getNextPageParam(lastPage, _allPages, lastPageParam) {
        return lastPage?.length >= limit ? lastPageParam + 1 : undefined;
      },
      ...defaultInfiniteQueryOptions,
    },
    queryClient,
  );

  return derived(response, ($res) => {
    const isEmpty = isResponseEmpty($res.data as InfiniteData<TQueryFnData>);

    return {
      ...$res,
      isEmpty,
    };
  });
}

export const defaultInfiniteQueryOptions = {
  initialPageParam: 1,
} satisfies Omit<
  TSCreateInfiniteQueryOptions<
    unknown,
    DefaultError,
    unknown,
    unknown,
    QueryKey,
    number
  >,
  "queryKey" | "getNextPageParam"
>;
