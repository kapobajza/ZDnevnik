<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SvelteHTMLElements } from "svelte/elements";
  import { Typography } from "$lib/components/ui/Typography";

  type $$Props = SvelteHTMLElements["nav"] & {
    title: string;
  };

  let className: $$Props["class"] = undefined;
  export let title: $$Props["title"];
  export { className as class };
</script>

<nav
  class={cn(
    "zd-h-nav-bar zd-bg-primary zd-px-4 zd-pb-6 zd-flex zd-items-end",
    className,
  )}
  {...$$restProps}
>
  <Typography variant="h3" class="zd-text-primary-foreground">
    {title}
  </Typography>
</nav>
