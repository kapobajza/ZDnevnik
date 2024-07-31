import {
  errorResponseSchema,
  type ErrorResponseLiteral,
  type LoginBody,
} from "@zdnevnik/toolkit";
import { z } from "zod";

import type { TranslationFunctions } from "$src/i18n/i18n-types";

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

export const initZodErrorMap = (LL: TranslationFunctions) => {
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
};

export const isResponseCode = (error: unknown, code: ErrorResponseLiteral) => {
  const errRes = errorResponseSchema.safeParse(error);
  return errRes.success && errRes.data.code === code;
};
