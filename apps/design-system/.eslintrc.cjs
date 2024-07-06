/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["plugin:react-hooks/recommended", "../../.eslintrc.strict.js"],
  ignorePatterns: ["!**/*", "dist", ".eslintrc.cjs"],
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true }
    ]
  },
  parserOptions: {
    project: "./tsconfig.json"
  }
};
