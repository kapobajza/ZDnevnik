<script context="module" lang="ts">
  import Button from "./button.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Button",
    component: Button,
    tags: ["autodocs"],
  });
</script>

<Story name="Primary">
  <Button variant="primary">Primary</Button>
</Story>

<Story name="Primary Disabled">
  <Button disabled>Primary disabled</Button>
</Story>
