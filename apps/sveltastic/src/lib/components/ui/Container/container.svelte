<script lang="ts">
  import { useContext } from "$lib/util";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import { Loader } from "$lib/components/ui/Loader";

  const {
    isEmpty,
    isPending,
    class: className,
    empty,
    children,
    ...otherProps
  }: SvelteHTMLElements["div"] & {
    isEmpty?: boolean;
    isPending?: boolean;
    children: Snippet;
    empty?: Snippet;
  } = $props();

  const LL = useContext("LL");
</script>

<div
  class={cn("zd-px-8 zd-w-full lg:zd-max-w-[1024px] lg:zd-m-auto", className)}
  {...otherProps}
>
  {#if isPending}
    <div class="zd-mt-10">
      <Loader size="large" />
    </div>
  {:else if empty && isEmpty}
    {@render empty()}
  {:else if isEmpty}
    {$LL.no_results()}
  {:else}
    {@render children()}
  {/if}
</div>
