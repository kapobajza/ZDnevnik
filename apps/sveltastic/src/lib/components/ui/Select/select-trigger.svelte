<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";
  import type { SelectTriggerSlots } from "node_modules/bits-ui/dist/bits/select/components/select-trigger.svelte";

  const {
    class: className,
    children,
    ...restProps
  }: Omit<SelectPrimitive.TriggerProps, "children"> & {
    children: Snippet<[SelectTriggerSlots["default"]["builder"]]>;
  } = $props();
</script>

<SelectPrimitive.Trigger
  class={cn(
    "zd-border-input focus-visible:zd-ring-2 focus-visible:zd-ring-ring focus-visible:zd-ring-offset-2",
    "file:zd-bg-transparent zd-flex zd-h-10 zd-w-full zd-items-center zd-justify-between zd-rounded-md zd-border zd-bg-primary-foreground zd-px-3 zd-py-2 zd-text-p_ui zd-ring-offset-background file:zd-border-0 file:zd-text-p_ui file:zd-font-medium focus-visible:zd-outline-none disabled:zd-cursor-not-allowed disabled:zd-opacity-50 [&>span]:zd-line-clamp-1 data-[placeholder]:[&>span]:zd-text-muted-foreground",
    className,
  )}
  {...restProps}
  let:builder
  on:click
  on:keydown
>
  {@render children(builder)}
  <div>
    <ChevronDown class="zd-size-4 zd-opacity-50" />
  </div>
</SelectPrimitive.Trigger>
