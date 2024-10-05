<script lang="ts">
  import "../app.css";
  import { setLocale } from "$src/i18n/i18n-svelte";
  import type { LayoutData } from "./$types";
  import { LL } from "$src/i18n/i18n-svelte";
  import { createContext } from "$lib/util/context";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import type { Snippet } from "svelte";

  const {
    data,
    children,
  }: {
    data: LayoutData;
    children: Snippet;
  } = $props();

  setLocale(data.locale);
  createContext("LL", LL);
</script>

<QueryClientProvider client={data.queryClient}>
  {@render children()}
  <SvelteQueryDevtools buttonPosition="bottom-left" />
</QueryClientProvider>
