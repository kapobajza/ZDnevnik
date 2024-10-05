<script lang="ts">
  import { useContext } from "$lib/util";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import { Loader } from "$lib/components/ui/Loader";
  import { Typography } from "$lib/components/ui/Typography";

  const {
    isEmpty,
    isPending,
    class: className,
    empty,
    children,
    isError,
    error,
    ...otherProps
  }: SvelteHTMLElements["div"] & {
    isEmpty?: boolean;
    isPending?: boolean;
    children: Snippet;
    empty?: Snippet;
    isError?: boolean;
    error?: Error | null;
  } = $props();

  const LL = useContext("LL");
</script>

<div
  class={cn("zd-w-full zd-px-4 lg:zd-m-auto lg:zd-max-w-[1024px]", className)}
  {...otherProps}
>
  {#if isPending}
    <div class="zd-mt-10">
      <Loader size="large" />
    </div>
  {:else if isError}
    <div class="zd-flex zd-flex-col zd-items-center">
      <Typography variant="h3">
        {$LL.error_title()}
      </Typography>
      <Typography variant="p">
        {$LL.error_unknown()}
      </Typography>
    </div>
  {:else if empty && isEmpty}
    {@render empty()}
  {:else if isEmpty}
    {$LL.no_results()}
  {:else}
    {@render children()}
  {/if}
</div>
