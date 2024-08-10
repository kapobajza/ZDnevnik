<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";

  const {
    class: className,
    children,
    ...otherProps
  }: HTMLAttributes<HTMLDivElement> & {
    children: Snippet;
  } = $props();
</script>

<div
  class={cn(
    "zd-bg-card zd-text-card-foreground zd-rounded-lg zd-shadow-card-foreground/10 zd-shadow-card zd-p-4",
    className,
  )}
  {...otherProps}
>
  {@render children()}
</div>
