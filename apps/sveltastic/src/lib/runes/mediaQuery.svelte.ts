import { onMount } from "svelte";

export function createMediaQuery(query: string) {
  let matches = $state(false);

  onMount(() => {
    const mediaQueryList = window.matchMedia(query);
    matches = mediaQueryList.matches;

    const onChange = (event: MediaQueryListEvent) => {
      matches = event.matches;
    };

    mediaQueryList.addEventListener("change", onChange);

    return () => {
      mediaQueryList.removeEventListener("change", onChange);
    };
  });

  return {
    get matches() {
      return matches;
    },
  };
}
