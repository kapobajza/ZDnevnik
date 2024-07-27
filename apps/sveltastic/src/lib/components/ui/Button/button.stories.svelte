<script context="module" lang="ts">
  import Button from "./button.svelte";
  import { type Meta } from "@storybook/svelte";

  export const meta: Meta<Button> = {
    title: "Components/Button",
    component: Button,
    tags: ["autodocs"],
  };
</script>

<script>
  import { Story } from "@storybook/addon-svelte-csf";
</script>

<Story name="Primary">
  <Button variant="primary">Primary</Button>
</Story>

<Story name="Primary Disabled">
  <Button disabled>Primary disabled</Button>
</Story>
