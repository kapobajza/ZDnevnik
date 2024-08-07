<script lang="ts">
  import { useContext } from "$lib/util";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  const {
    isEmpty,
    isPending,
    class: className,
    Empty,
    children,
    ...otherProps
  }: SvelteHTMLElements["div"] & {
    isEmpty?: boolean;
    isPending?: boolean;
    children: Snippet;
    Empty?: Snippet;
  } = $props();

  const LL = useContext("LL");
</script>

<div
  class={cn("zd-px-8 lg:zd-max-w-[1024px] lg:zd-m-auto", className)}
  {...otherProps}
>
  {#if isPending}
    Loading...
  {:else if Empty && isEmpty}
    {@render Empty()}
  {:else if isEmpty}
    {$LL.no_results()}
  {:else}
    {@render children()}
  {/if}
</div>
