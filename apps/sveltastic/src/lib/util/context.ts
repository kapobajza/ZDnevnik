import type { Readable } from "svelte/store";
import { getContext, setContext } from "svelte";

import type { TranslationFunctions } from "$src/i18n/i18n-types";
import type { ApiInstance } from "$lib/api";

export type Context = {
  LL: Readable<TranslationFunctions>;
  api: ApiInstance;
};

export const createContext = <
  TKey extends keyof Context,
  TContext extends Context[TKey],
>(
  key: TKey,
  context: TContext,
) => {
  return setContext(key, context);
};

export const useContext = <TKey extends keyof Context>(
  key: TKey,
): Context[TKey] => {
  return getContext<Context[TKey]>(key);
};
