<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { HeadingLevel } from "./index.js";
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";

  const {
    class: className,
    level = "h5",
    children,
    ...otherProps
  }: HTMLAttributes<HTMLHeadingElement> & {
    level?: HeadingLevel;
    children: Snippet;
  } = $props();
</script>

<svelte:element
  this={level}
  class={cn(
    "zd-mb-1 zd-font-medium zd-leading-none zd-tracking-tight",
    className,
  )}
  {...otherProps}
>
  {@render children()}
</svelte:element>
