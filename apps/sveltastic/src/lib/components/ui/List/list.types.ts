import type { InfiniteData } from "@tanstack/svelte-query";
import type { Snippet } from "svelte";

import type { InfiniteQueryFnData } from "$lib/query/util";

export type ListProps<TData> = {
  class?: string;
  data:
    | InfiniteData<InfiniteQueryFnData<TData[], Record<string, unknown>>>
    | undefined;
  renderItem: Snippet<[TData]>;
  onEndReached?: () => Promise<unknown>;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
};
