<script context="module" lang="ts">
  import { defineMeta, type Args } from "@storybook/addon-svelte-csf";
  import ProgressBar from "./progress_bar.svelte";

  const { Story } = defineMeta({
    title: "Components/ProgressBar",
    component: ProgressBar,
    tags: ["autodocs"],
    args: {
      value: 10,
      max: 100,
    },
  });
</script>

<Story name="Default">
  {#snippet children(args: Args<typeof Story>)}
    <ProgressBar value={args.value ?? 10} max={args.max ?? 100} />
  {/snippet}
</Story>

<Story name="Max">
  <ProgressBar value={100} max={100} />
</Story>

<Story name="Min">
  <ProgressBar value={0} max={100} />
</Story>
