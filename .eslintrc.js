/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ["**/*"],
  plugins: ["@typescript-eslint", "import", "prettier", "unused-imports"],
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["off"],
        "no-shadow": "off",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/consistent-type-imports": "error",
      },
    },
  ],
  rules: {
    "no-console": "error",
    "no-nested-ternary": "error",
    "no-else-return": [
      "error",
      {
        allowElseIf: false,
      },
    ],
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
      },
    ],
  },
};
