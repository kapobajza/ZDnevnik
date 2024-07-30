<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputEvents } from "./index.js";
  import { cn } from "$lib/utils.js";
  import { Typography } from "$lib/components/ui/Typography/index.js";

  type $$Props = HTMLInputAttributes & {
    error?: string | undefined;
    containerClass?: string;
  };
  type $$Events = InputEvents;

  let className: $$Props["class"] = undefined;
  export let value: $$Props["value"] = undefined;
  export let error: string | undefined = undefined;
  export { className as class };

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  export let readonly: $$Props["readonly"] = undefined;
  export let containerClass: $$Props["containerClass"] = undefined;
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
    {readonly}
    on:blur
    on:change
    on:click
    on:focus
    on:focusin
    on:focusout
    on:keydown
    on:keypress
    on:keyup
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:mousemove
    on:paste
    on:input
    on:wheel|passive
    aria-label={$$restProps.name}
    {...$$restProps}
  />

  {#if error}
    <Typography variant="small" class="zd-text-destructive">{error}</Typography>
  {/if}
</div>
