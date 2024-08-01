<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";

  type $$Props = SvelteHTMLElements["div"];
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div
  class={cn("zd-px-8 lg:zd-max-w-[1024px] lg:zd-m-auto", className)}
  {...$$restProps}
>
  <slot />
</div>
