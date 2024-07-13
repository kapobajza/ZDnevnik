/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["../../.eslintrc.strict.js"],
  ignorePatterns: ["!**/*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "off",
  },
};
