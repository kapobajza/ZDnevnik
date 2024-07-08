/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["../../.eslintrc.strict.js"],
  ignorePatterns: ["!**/*"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "off",
  },
  env: {
    es6: true,
  },
};
