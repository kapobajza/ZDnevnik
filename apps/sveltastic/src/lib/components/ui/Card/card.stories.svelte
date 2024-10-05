<script context="module" lang="ts">
  import Card from "./card.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Card",
    component: Card,
  });
</script>

<Story name="Default">
  <Card>
    <p>Card content</p>
  </Card>
</Story>
