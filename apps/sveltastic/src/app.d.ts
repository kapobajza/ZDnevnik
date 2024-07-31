/* eslint-disable @typescript-eslint/consistent-type-definitions */
// See https://kit.svelte.dev/docs/types#app

import type { TranslationFunctions } from "./i18n/i18n-types";

import type { ApiInstance } from "$lib/api";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      api: ApiInstance;
      LL: TranslationFunctions;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
