import "@testing-library/jest-dom/vitest";

import { initMockI18n } from "./i18n";

import { initZodErrorMap } from "$lib/util";

initMockI18n();

initZodErrorMap();
