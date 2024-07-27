/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "../../.eslintrc.strict.js",
    "plugin:svelte/recommended",
    "plugin:tailwindcss/recommended",
  ],
  ignorePatterns: ["!**/*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    extraFileExtensions: [".svelte"],
  },
  overrides: [
    {
      files: ["**/*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".svelte"],
      },
    },
  ],
  rules: {
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "error",
  },
};
