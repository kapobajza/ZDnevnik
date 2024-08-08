<script context="module" lang="ts">
  import Loader from "./loader.svelte";
  import { type Meta } from "@storybook/svelte";

  export const meta: Meta<Loader> = {
    title: "Components/Loader",
    component: Loader,
    tags: ["autodocs"],
  };
</script>

<script>
  import { Story } from "@storybook/addon-svelte-csf";
</script>

<Story name="Loader" id="LoaderStory">
  <Loader />
</Story>
