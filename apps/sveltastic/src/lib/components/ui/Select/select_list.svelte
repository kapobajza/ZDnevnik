<script lang="ts" generics="TItem extends SelectListItem">
  import SelectContent from "./select_content.svelte";
  import SelectLabel from "./select_label.svelte";
  import SelectTrigger from "./select_trigger.svelte";
  import type { SelectListItem, SelectListProps } from "./select.types";
  import { Select as SelectPrimitive } from "bits-ui";
  import SelectItem from "./select_item.svelte";

  const {
    placeholder,
    class: className,
    label,
    selected,
    trigger,
    contentProps,
    ...restProps
  }: SelectListProps<TItem> = $props();
</script>

<SelectPrimitive.Root
  onSelectedChange={restProps.onSelectedChange as any}
  {selected}
  {...restProps}
>
  {#if trigger}
    {@render trigger()}
  {:else}
    <SelectTrigger>
      <SelectPrimitive.Value {placeholder} />
    </SelectTrigger>
  {/if}
  <SelectContent class={className} {...contentProps}>
    <SelectPrimitive.Group>
      {#if label}
        <SelectLabel>{label}</SelectLabel>
      {/if}
      {#if restProps.content}
        {@render restProps.content()}
      {:else}
        {#each restProps.items as item (item.id)}
          <SelectItem
            value={item.value}
            disabled={item.disabled}
            label={item.label}
          >
            {@render restProps.renderItem(item)}
          </SelectItem>
        {/each}
      {/if}
    </SelectPrimitive.Group>
  </SelectContent>
</SelectPrimitive.Root>
