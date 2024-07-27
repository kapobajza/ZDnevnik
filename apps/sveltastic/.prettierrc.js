import prettierConfig from "../../.prettierrc.js";

/** @type {import('prettier').Config} */
export default {
  ...prettierConfig,
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
