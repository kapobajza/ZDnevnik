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
  class={cn("zd-text-small [&_p]:zd-leading-relaxed", className)}
  {...otherProps}
>
  {@render children()}
</div>
