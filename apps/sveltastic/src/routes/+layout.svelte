<script lang="ts">
  import "../app.css";
  import { setLocale } from "$src/i18n/i18n-svelte";
  import type { LayoutData } from "./$types";
  import { LL } from "$src/i18n/i18n-svelte";
  import { createContext } from "$lib/util/context";
  import { createApiInstance } from "$lib/api";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { page } from "$app/stores";

  export let data: LayoutData;

  setLocale(data.locale);
  createContext("LL", LL);
  createContext(
    "api",
    createApiInstance({
      origin: $page.url.origin,
    }),
  );
</script>

<QueryClientProvider client={data.queryClient}>
  <slot></slot>
  <SvelteQueryDevtools />
</QueryClientProvider>
