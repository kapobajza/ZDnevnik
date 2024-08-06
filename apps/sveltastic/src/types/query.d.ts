import type {
  QueryClient as TSQueryClient,
  QueryKey,
  DefaultError,
  FetchInfiniteQueryOptions,
} from "@tanstack/svelte-query";

import type { InfiniteQueryFunction } from "$lib/query/util";

declare module "@tanstack/svelte-query" {
  declare class QueryClient extends Omit<
    TSQueryClient,
    "prefetchInfiniteQuery"
  > {
    prefetchInfiniteQuery<
      TQueryFnData,
      TError = DefaultError,
      TData = TQueryFnData,
      TQueryKey extends QueryKey = QueryKey,
      TPageParam = unknown,
    >(
      options: Omit<
        FetchInfiniteQueryOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryKey,
          TPageParam
        >,
        "queryFn"
      > & {
        queryFn: InfiniteQueryFunction<TQueryFnData>;
      },
    ): Promise<void>;
  }
}
