<script context="module" lang="ts">
  import { Button } from "$lib/components/ui/Button";
  import Dialog from "./dialog.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Dialog",
    component: Dialog,
    tags: ["autodocs"],
  });
</script>

<Story name="Default">
  <Dialog
    title="Title"
    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti dolorem rerum aspernatur, alias, cumque earum voluptatibus expedita enim eligendi, optio necessitatibus ea laborum quibusdam omnis eum quo nemo! Saepe, necessitatibus."
  >
    {#snippet trigger(open)}
      <Button on:click={open}>Open</Button>
    {/snippet}

    {#snippet content()}
      <Button class="zd-w-full">Submit</Button>
    {/snippet}
  </Dialog>
</Story>
