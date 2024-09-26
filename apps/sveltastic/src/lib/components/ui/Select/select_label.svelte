<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";

  const {
    class: className,
    children,
    ...restProps
  }: Omit<SelectPrimitive.LabelProps, "children"> & {
    children: Snippet;
  } = $props();
</script>

<SelectPrimitive.Label
  class={cn(
    "zd-py-1.5 zd-pl-8 zd-pr-2 zd-text-subtle zd-font-semibold",
    className,
  )}
  {...restProps}
>
  {@render children()}
</SelectPrimitive.Label>
