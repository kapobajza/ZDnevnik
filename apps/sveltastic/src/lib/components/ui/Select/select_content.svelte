<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { scale } from "svelte/transition";
  import { cn, flyAndScale } from "$lib/utils.js";
  import type { SelectContentProps } from "./select.types";

  const {
    children,
    sideOffset = 4,
    inTransition = flyAndScale,
    inTransitionConfig = undefined,
    outTransition = scale,
    outTransitionConfig = { start: 0.95, opacity: 0, duration: 50 },
    class: className,
    ...otherProps
  }: SelectContentProps = $props();
</script>

<SelectPrimitive.Content
  {inTransition}
  {inTransitionConfig}
  {outTransition}
  {outTransitionConfig}
  {sideOffset}
  class={cn(
    "zd-shadow-md zd-relative zd-z-50 zd-min-w-[8rem] zd-overflow-hidden zd-rounded-md zd-border zd-bg-popover zd-text-popover-foreground zd-outline-none",
    className,
  )}
  {...otherProps}
>
  <div class="zd-w-full zd-p-1">
    {@render children()}
  </div>
</SelectPrimitive.Content>
