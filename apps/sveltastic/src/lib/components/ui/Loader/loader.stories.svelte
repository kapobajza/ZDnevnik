<script context="module" lang="ts">
  import Loader from "./loader.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Loader",
    component: Loader,
  });
</script>

<Story name="Default">
  <Loader />
</Story>
