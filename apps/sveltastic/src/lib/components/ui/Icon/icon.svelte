<script lang="ts">
  import type { IconName } from "./icon.types";
  import type { SvelteHTMLElements } from "svelte/elements";
  import * as iconsMap from "./svg";

  const {
    class: className,
    name,
    ...otherProps
  }: SvelteHTMLElements["svg"] & {
    name: IconName;
  } = $props();

  const selected = iconsMap[name];
</script>

<svelte:component this={selected} class={className} {...otherProps} />
