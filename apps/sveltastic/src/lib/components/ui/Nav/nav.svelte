<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";
  import { Typography } from "$lib/components/ui/Typography";

  const {
    title,
    class: className,
    ...otherProps
  }: SvelteHTMLElements["nav"] & {
    title: string;
  } = $props();
</script>

<nav
  class={cn(
    "zd-h-nav-bar zd-bg-primary zd-px-4 zd-pb-6 zd-flex zd-items-end",
    className,
  )}
  {...otherProps}
>
  <Typography variant="h3" class="zd-text-primary-foreground">
    {title}
  </Typography>
</nav>
