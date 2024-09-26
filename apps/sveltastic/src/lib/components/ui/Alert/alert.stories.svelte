<script context="module" lang="ts">
  import Alert from "./alert.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Alert",
    component: Alert,
  });
</script>

<Story name="Default">
  <Alert title="Title" description="Description" />
</Story>

<Story name="Destructive">
  <Alert title="Title" description="Description" variant="destructive" />
</Story>
