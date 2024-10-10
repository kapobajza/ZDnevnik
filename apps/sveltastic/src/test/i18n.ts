import { initI18nSvelte } from "typesafe-i18n/svelte";
import type { Readable } from "svelte/store";

import type {
  Formatters,
  Locales,
  TranslationFunctions,
  Translations,
} from "$src/i18n/i18n-types";
import { loadedFormatters } from "$src/i18n/i18n-util";
import ba from "$src/i18n/ba";
import en from "$src/i18n/en";

export let MockLL: Readable<TranslationFunctions>;

export const initMockI18n = () => {
  const loadedLocales: Record<Locales, Translations> = {
    ba: ba as Translations,
    en: en as Translations,
  };

  const { LL, setLocale } = initI18nSvelte<
    Locales,
    Translations,
    TranslationFunctions,
    Formatters
  >(loadedLocales, loadedFormatters);

  setLocale("ba");

  MockLL = LL;
};
