import type {
  QueryObserverResult as TSQueryObserverResult,
  DefaultError,
  QueryClient,
  QueryKey,
  StoreOrVal,
  UndefinedInitialDataOptions,
} from "@tanstack/svelte-query";
import { createQuery as createTSQuery } from "@tanstack/svelte-query";
import { derived, type Readable } from "svelte/store";

const isResponseEmpty = <TData = unknown>(data: TData) => {
  if (Array.isArray(data) && data.length === 0) {
    return true;
  }

  return !data;
};

export type QueryObserverResult<TData, TError> = TSQueryObserverResult<
  TData,
  TError
> & {
  isEmpty: boolean;
};

export type CreateQueryResult<TData, TError> = Readable<
  QueryObserverResult<TData, TError>
>;

export function createQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: StoreOrVal<
    UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  >,
  queryClient?: QueryClient,
): CreateQueryResult<TData, TError> {
  const response = createTSQuery(options, queryClient);

  return derived(response, ($res) => {
    const isEmpty = isResponseEmpty($res.data);

    return {
      ...$res,
      isEmpty,
    };
  });
}
