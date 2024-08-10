<script context="module" lang="ts">
  import Input from "./input.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Input",
    component: Input,
    tags: ["autodocs"],
  });
</script>

<Story name="Default">
  <Input placeholder="Enter some text..." />
</Story>

<Story name="Input with error">
  <Input placeholder="Enter some text..." error="Error message" />
</Story>
