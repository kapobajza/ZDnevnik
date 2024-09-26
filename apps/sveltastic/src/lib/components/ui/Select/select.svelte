<script lang="ts" generics="TItem extends SelectListItem">
  import type { Snippet } from "svelte";
  import SelectContent from "./select-content.svelte";
  import SelectItem from "./select-item.svelte";
  import SelectLabel from "./select-label.svelte";
  import SelectTrigger from "./select-trigger.svelte";
  import type { SelectListItem } from "./select.types";
  import { Select as SelectPrimitive, type SelectProps } from "bits-ui";

  const {
    placeholder,
    class: className,
    items,
    label,
    renderItem,
    ...restProps
  }: {
    class?: string;
    items: TItem[];
    placeholder?: string;
    label?: string;
    renderItem: Snippet<[TItem]>;
  } & Omit<SelectProps<"root">, "items"> = $props();
</script>

<SelectPrimitive.Root portal={null} {...restProps}>
  <SelectTrigger>
    <SelectPrimitive.Value {placeholder} />
  </SelectTrigger>
  <SelectContent class={className}>
    <SelectPrimitive.Group>
      {#if label}
        <SelectLabel>{label}</SelectLabel>
      {/if}
      {#each items as item}
        <SelectItem
          value={item.value}
          disabled={item.disabled}
          label={item.label}
        >
          {@render renderItem(item)}
        </SelectItem>
      {/each}
    </SelectPrimitive.Group>
  </SelectContent>
</SelectPrimitive.Root>
