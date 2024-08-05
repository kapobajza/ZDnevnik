<script lang="ts">
  import "../app.css";
  import { setLocale } from "$src/i18n/i18n-svelte";
  import type { LayoutData } from "./$types";
  import { LL } from "$src/i18n/i18n-svelte";
  import { createContext } from "$lib/util/context";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

  export let data: LayoutData;

  setLocale(data.locale);
  createContext("LL", LL);
</script>

<QueryClientProvider client={data.queryClient}>
  <slot></slot>
  <SvelteQueryDevtools />
</QueryClientProvider>
