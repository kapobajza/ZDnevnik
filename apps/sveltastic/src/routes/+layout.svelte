<script lang="ts">
  import "../app.css";
  import { setLocale } from "$src/i18n/i18n-svelte";
  import type { LayoutData } from "./$types";
  import { LL } from "$src/i18n/i18n-svelte";
  import { createContext } from "$lib/util/context";
  import { createApiInstance } from "$lib/api";

  export let data: LayoutData;
  // at the very top, set the locale before you access the store and before the actual rendering takes place
  setLocale(data.locale);
  createContext("LL", LL);
  createContext("api", createApiInstance());
</script>

<slot></slot>
