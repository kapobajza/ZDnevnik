/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "import", "prettier"],
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
        "./.eslintrc.js",
      ],
      files: ["*.ts", "*.tsx"],
    },
  ],
  rules: {
    "no-void": ["error", { allowAsStatement: true }],
    "no-else-return": [
      "error",
      {
        allowElseIf: false,
      },
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
  },
};
