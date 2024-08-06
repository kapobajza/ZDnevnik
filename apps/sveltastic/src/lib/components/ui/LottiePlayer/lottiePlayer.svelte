<script lang="ts">
  import {
    LottiePlayer,
    type LottiePlayerProps,
  } from "@lottiefiles/svelte-lottie-player";
  import { onMount } from "svelte";

  let Player: LottiePlayer;

  type $$Props = LottiePlayerProps & {
    class?: string;
  };

  let className: $$Props["class"] = undefined;

  export { className as class };

  onMount(async () => {
    const module = await import("@lottiefiles/svelte-lottie-player");
    Player = module.LottiePlayer as unknown as LottiePlayer;
  });
</script>

{#if Player}
  <Player class={className} {...$$restProps} />
{/if}
