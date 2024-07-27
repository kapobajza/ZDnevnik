<script context="module" lang="ts">
  import Alert from "./alert.svelte";
  import { type Meta } from "@storybook/svelte";

  export const meta: Meta<Alert> = {
    title: "Components/Alert",
    component: Alert,
    tags: ["autodocs"],
  };
</script>

<script>
  import { Story } from "@storybook/addon-svelte-csf";
</script>

<Story name="Default">
  <Alert title="Title" description="Description" />
</Story>

<Story name="Destructive">
  <Alert title="Title" description="Description" variant="destructive" />
</Story>
