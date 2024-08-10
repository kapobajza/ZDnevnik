<script lang="ts">
  import {
    type LottiePlayerProps,
    type LottiePlayeComponent,
  } from "@lottiefiles/svelte-lottie-player";
  import { onMount } from "svelte";

  let Player: LottiePlayeComponent | undefined = $state(undefined);

  const {
    class: className,
    ...otherProps
  }: LottiePlayerProps & {
    class?: string;
  } = $props();

  onMount(async () => {
    const module = await import("@lottiefiles/svelte-lottie-player");
    Player = module.LottiePlayer;
  });
</script>

{#if Player}
  <svelte:component this={Player} class={className} {...otherProps} />
{/if}
