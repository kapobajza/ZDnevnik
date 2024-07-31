import "@testing-library/jest-dom/vitest";
import { get } from "svelte/store";

import { MockLL, initMockI18n } from "./i18n";

import { initZodErrorMap } from "$lib/util";

initMockI18n();

initZodErrorMap(get(MockLL));
