<script lang="ts">
  import type { IconName } from "./icon.types";
  import type { SvelteHTMLElements } from "svelte/elements";
  import * as iconsMap from "./svg";

  export let name: IconName;

  type $$Props = SvelteHTMLElements["svg"] & {
    name: IconName;
  };

  const selected: any = iconsMap[name];

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<svelte:component this={selected} class={className} {...$$restProps} />
