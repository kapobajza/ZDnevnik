<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";
  import { Typography } from "$lib/components/ui/Typography/index.js";

  let {
    class: className,
    error,
    containerClass,
    name,
    value = $bindable(),
    ...otherProps
  }: HTMLInputAttributes & {
    error?: string | undefined;
    containerClass?: string;
  } = $props();
</script>

<div class={containerClass}>
  <input
    class={cn(
      error
        ? "zd-border-destructive focus-visible:zd-ring-0"
        : "zd-border-input focus-visible:zd-ring-2 focus-visible:zd-ring-ring focus-visible:zd-ring-offset-2",
      "zd-flex zd-h-10 zd-w-full zd-rounded-md zd-border zd-bg-primary-foreground zd-px-3 zd-py-2 zd-text-p_ui zd-ring-offset-background file:zd-border-0 file:zd-bg-transparent file:zd-text-p_ui file:zd-font-medium placeholder:zd-text-muted-foreground focus-visible:zd-outline-none disabled:zd-cursor-not-allowed disabled:zd-opacity-50",
      className,
    )}
    bind:value
    aria-label={name}
    {...otherProps}
  />

  {#if error}
    <Typography variant="small" class="zd-text-destructive">{error}</Typography>
  {/if}
</div>
