<script lang="ts" generics="TData extends { id: string }">
  import { onMount } from "svelte";
  import { Loader } from "$lib/components/ui/Loader";
  import type { ListProps } from "./list.types";

  const {
    class: className,
    data,
    renderItem,
    onEndReached,
    hasNextPage,
    isLoadingMore,
  }: ListProps<TData> = $props();

  let lastElement: HTMLDivElement;
  let onEndReachedPromise: Promise<unknown> | null = null;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!onEndReached || !hasNextPage) {
          return;
        }

        if (onEndReachedPromise) {
          return;
        }

        const entry = entries[0];

        if (entry?.isIntersecting) {
          onEndReachedPromise = onEndReached();
          onEndReachedPromise?.finally(() => (onEndReachedPromise = null));
        }
      },
      {
        threshold: 0.5,
        root: null,
      },
    );

    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class={className}>
  {#each data?.pages ?? [] as page (page)}
    {#each page?.results as singleItem (singleItem.id)}
      {@render renderItem(singleItem)}
    {/each}
  {/each}
  {#if isLoadingMore}
    <Loader size="small" />
  {/if}
  <div class="zd-size-0" bind:this={lastElement}></div>
</div>
