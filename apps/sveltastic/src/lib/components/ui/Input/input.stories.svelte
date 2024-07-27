<script context="module" lang="ts">
  import Input from "./input.svelte";
  import { type Meta } from "@storybook/svelte";

  export const meta: Meta<Input> = {
    title: "Components/Input",
    component: Input,
    tags: ["autodocs"],
  };
</script>

<script>
  import { Story } from "@storybook/addon-svelte-csf";
</script>

<Story name="Input" id="InputStory">
  <Input placeholder="Enter some text..." />
</Story>

<Story name="Input with error" id="InputWithError">
  <Input placeholder="Enter some text..." error="Error message" />
</Story>
