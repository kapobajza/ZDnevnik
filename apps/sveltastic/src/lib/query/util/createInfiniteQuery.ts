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

export type InfiniteQueryObserverResult<
  TData,
  TError,
  TExtraData extends Record<string, unknown> | undefined,
> = TSQInfiniteQueryObserverResult<TData, TError> &
  AdditionalQueryResult & {
    extraData?: TExtraData;
  };

export type CreateInfiniteQueryResult<
  TData,
  TError,
  TExtraData extends Record<string, unknown> | undefined,
> = Readable<InfiniteQueryObserverResult<TData, TError, TExtraData>>;

export type InfiniteQueryFunctionContext<
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> = QueryFunctionContext<TQueryKey, TPageParam> & {
  page: number;
  limit: number;
};

export type InfiniteQueryFnData<
  TData extends Array<unknown> = Array<unknown>,
  TExtraData extends Record<string, unknown> = Record<string, unknown>,
> = {
  results: TData;
  extraData?: TExtraData;
};

export type InfiniteQueryFunction<TQueryData extends InfiniteQueryFnData> = (
  context: InfiniteQueryFunctionContext,
) => Promise<TQueryData>;

export type CreateInfiniteQueryOptions<
  TQueryFnData extends InfiniteQueryFnData = InfiniteQueryFnData<
    unknown[],
    Record<string, unknown>
  >,
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

const isResponseEmpty = <
  TData extends InfiniteQueryFnData<unknown[], Record<string, unknown>>,
>(
  data: InfiniteData<TData>,
) => {
  return data?.pages?.[0]?.results?.length === 0;
};

const DEFAULT_LIMIT = 10;

export function createInfiniteQuery<
  TQueryFnData extends InfiniteQueryFnData<unknown[], Record<string, unknown>>,
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
): CreateInfiniteQueryResult<TData, TError, TQueryFnData["extraData"]> {
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
        return lastPage?.results?.length >= limit
          ? lastPageParam + 1
          : undefined;
      },
      ...defaultInfiniteQueryOptions,
    },
    queryClient,
  );

  return derived(response, ($res) => {
    const data = $res.data as InfiniteData<TQueryFnData>;
    const isEmpty = isResponseEmpty(data);
    const { extraData } = data.pages?.[0] as InfiniteQueryFnData<
      unknown[],
      Record<string, unknown>
    >;

    return {
      ...$res,
      isEmpty,
      extraData: extraData as TQueryFnData["extraData"],
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
