/* eslint-disable @typescript-eslint/consistent-type-definitions */
// See https://kit.svelte.dev/docs/types#app

import type { TranslationFunctions } from "./i18n/i18n-types";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      LL: TranslationFunctions;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
