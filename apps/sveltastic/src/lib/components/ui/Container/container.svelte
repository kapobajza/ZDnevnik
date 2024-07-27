<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";

  type $$Props = SvelteHTMLElements["div"];
</script>

<div
  class={cn("zd-px-8 lg:zd-max-w-[1024px] lg:zd-m-auto", $$props.class)}
  {...$$restProps}
>
  <slot />
</div>
