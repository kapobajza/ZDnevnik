<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLDivAttributes } from "node_modules/bits-ui/dist/internal";
  import { fly } from "svelte/transition";

  const {
    class: className,
    value,
    max,
    ...otherProps
  }: HTMLDivAttributes & {
    value: number;
    max: number;
  } = $props();

  const progressWidth = $derived((Math.min(value, max) / max) * 100);
</script>

<div
  class={cn(
    "zd-h-3 zd-relative zd-w-full [&>div]:zd-absolute [&>div]:zd-rounded-full",
    className,
  )}
  {...otherProps}
>
  <div class="zd-size-full zd-bg-secondary"></div>
  <div
    class="zd-bg-accent-300 zd-transition zd-h-full"
    style={`width: ${progressWidth.toFixed(2)}%`}
    in:fly
  ></div>
</div>
