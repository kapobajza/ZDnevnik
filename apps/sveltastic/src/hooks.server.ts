import type { Handle } from "@sveltejs/kit";
import { detectLocale } from "typesafe-i18n/detectors";
import { i18nObject } from "typesafe-i18n";
import { z } from "zod";
import type { LoginBody } from "@zdnevnik/toolkit";

import type { TranslationFunctions } from "./i18n/i18n-types";

import { baseLocale, locales } from "$src/i18n/i18n-util";
import { importLocaleAsync } from "$src/i18n/i18n-util.async";

let translationsLoaded = false;

type ValidationFieldRequiredParam = Parameters<
  TranslationFunctions["validation_field_required"]
>[0];

type ValidationFieldKey = keyof LoginBody;

const pathToFieldMapping: Record<
  ValidationFieldKey,
  ValidationFieldRequiredParam
> = {
  username: {
    field: "Korisničko ime",
  },
  password: {
    field: "Lozinka",
    gender: "f",
  },
};

export const handle: Handle = async ({ event, resolve }) => {
  if (!translationsLoaded) {
    const locale = detectLocale(baseLocale, locales);
    const importedLocales = await importLocaleAsync(locale);
    const LL: TranslationFunctions = i18nObject(locale, importedLocales);

    z.setErrorMap((issue) => {
      let message = issue.message ?? "";

      switch (issue.code) {
        case "too_small":
          const path = (issue.path?.[0] ?? "") as ValidationFieldKey;
          const mappedPath = pathToFieldMapping[path];

          if (!mappedPath) {
            return { message };
          }

          if (issue.minimum === 1) {
            message = LL.validation_field_required(mappedPath);
          } else {
            message = LL.validation_field_too_short(mappedPath);
          }
          break;
      }

      return { message };
    });

    translationsLoaded = false;
  }
  return await resolve(event);
};
