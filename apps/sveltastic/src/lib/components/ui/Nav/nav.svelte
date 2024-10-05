<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";
  import { Typography } from "$lib/components/ui/Typography";
  import type { Snippet } from "svelte";

  const {
    class: className,
    ...otherProps
  }:
    | (SvelteHTMLElements["nav"] & {
        title: string | undefined;
        content?: undefined;
      })
    | (SvelteHTMLElements["nav"] & {
        content: Snippet;
      }) = $props();
</script>

<nav
  class={cn(
    "zd-flex zd-h-nav-bar zd-items-end zd-bg-primary zd-px-4 zd-pb-nav-bar",
    className,
  )}
  {...otherProps}
>
  {#if otherProps.content}
    {@render otherProps.content()}
  {:else}
    <Typography variant="h3" class="zd-text-primary-foreground">
      {otherProps.title}
    </Typography>
  {/if}
</nav>
