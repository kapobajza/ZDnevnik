<script lang="ts">
  import { useContext } from "$lib/util";
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";

  type $$Props = SvelteHTMLElements["div"] & {
    isEmpty?: boolean;
    isPending?: boolean;
  };
  type $$Slots = {
    default: {};
    empty: {};
  };

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let isEmpty: $$Props["isEmpty"] = false;
  export let isPending: $$Props["isPending"] = false;

  const LL = useContext("LL");
</script>

<div
  class={cn("zd-px-8 lg:zd-max-w-[1024px] lg:zd-m-auto", className)}
  {...$$restProps}
>
  {#if isPending}
    Loading...
  {:else if $$slots.empty && isEmpty}
    <slot name="empty" />
  {:else if isEmpty}
    {$LL.no_results()}
  {:else}
    <slot />
  {/if}
</div>
