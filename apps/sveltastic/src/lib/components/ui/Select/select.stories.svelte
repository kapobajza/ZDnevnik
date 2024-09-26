<script context="module" lang="ts">
  import Select from "./select_list.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Select",
    component: Select,
    args: {
      disabled: false,
    },
    argTypes: {
      disabled: {
        control: "boolean",
      },
    },
  });
</script>

<Story name="Default">
  <Select
    items={[
      {
        id: "1",
        label: "Option 1",
        value: "1",
      },
      {
        id: "2",
        label: "Option 2",
        value: "2",
      },
      {
        id: "3",
        label: "Option 3",
        value: "3",
      },
    ]}
    placeholder="Select an option"
  >
    {#snippet renderItem(item)}
      <span>{item.label}</span>
    {/snippet}
  </Select>
</Story>

<Story name="Disabled">
  <Select>
    {#snippet content()}
      <span>Content</span>
    {/snippet}
  </Select>
</Story>
