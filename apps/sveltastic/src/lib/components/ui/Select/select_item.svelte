<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";
  import { Icon } from "$lib/components/ui/Icon";

  const {
    value,
    label,
    disabled,
    class: className,
    children,
    ...restProps
  }: Omit<SelectPrimitive.ItemProps, "children"> & {
    children: Snippet<[string | undefined, string | undefined]>;
  } = $props();
</script>

<SelectPrimitive.Item
  {value}
  {disabled}
  {label}
  class={cn(
    "zd-text-sm zd-relative zd-flex zd-w-full zd-cursor-default zd-select-none zd-items-center zd-rounded-sm zd-py-1.5 zd-pl-8 zd-pr-2 zd-outline-none data-[disabled]:zd-pointer-events-none data-[highlighted]:zd-bg-accent data-[highlighted]:zd-text-accent-foreground data-[disabled]:zd-opacity-50",
    className,
  )}
  {...restProps}
>
  <span
    class="zd-absolute zd-left-2 zd-flex zd-size-3.5 zd-items-center zd-justify-center"
  >
    <SelectPrimitive.ItemIndicator>
      <Icon name="Check" class="zd-size-4" />
    </SelectPrimitive.ItemIndicator>
  </span>
  {@render children(label, value as string)}
</SelectPrimitive.Item>
