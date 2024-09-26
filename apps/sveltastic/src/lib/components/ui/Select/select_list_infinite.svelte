<script lang="ts" generics="TItem extends SelectListItem">
  import type { InfiniteQueryFnData } from "$lib/query";
  import type { Snippet } from "svelte";
  import type { SelectListItem, SelectListProps } from "./select.types";
  import SelectList from "./select_list.svelte";
  import type { InfiniteData } from "@tanstack/svelte-query";
  import { List } from "$lib/components/ui/List";
  import type { ListProps } from "$lib/components/ui/List";
  import SelectItem from "./select_item.svelte";

  const {
    items,
    onEndReached,
    hasNextPage,
    isLoadingMore,
    ...restProps
  }: Omit<SelectListProps<TItem>, "content" | "items" | "renderItem"> &
    Omit<ListProps<TItem>, "data" | "renderItem"> & {
      items:
        | InfiniteData<InfiniteQueryFnData<TItem[], Record<string, unknown>>>
        | undefined;
      renderItem: Snippet<[TItem]>;
    } = $props();
</script>

<SelectList {...restProps}>
  {#snippet content()}
    <List data={items} {onEndReached} {hasNextPage} {isLoadingMore}>
      {#snippet renderItem(item)}
        <SelectItem
          value={item.value}
          disabled={item.disabled}
          label={item.label}
        >
          {@render restProps.renderItem(item)}
        </SelectItem>
      {/snippet}
    </List>
  {/snippet}
</SelectList>
