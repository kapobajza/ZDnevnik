/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ["**/*"],
  plugins: ["@typescript-eslint", "import", "prettier"],
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["off"],
        "no-shadow": "off",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"]
      }
    }
  ],
  rules: {
    "no-console": "error",
    "no-nested-ternary": "error",
    "no-else-return": [
      "error",
      {
        allowElseIf: false
      }
    ],
    "prettier/prettier": "error"
  }
};
