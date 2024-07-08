const { defineConfig } = require("rollup");
const typescript = require("@rollup/plugin-typescript");
const { dts } = require("rollup-plugin-dts");
const alias = require("@rollup/plugin-alias");
const path = require("path");

module.exports = defineConfig([
  {
    input: "index.ts",
    output: {
      file: "dist/toolkit.es.js",
      format: "es",
      sourcemap: true,
    },
    external: ["yaml", "tsx"],
    plugins: [
      alias({
        entries: {
          "~/toolkit": path.resolve("./src"),
        },
      }),
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [
      alias({
        entries: {
          "~/toolkit": path.resolve("./dist/src"),
        },
      }),
      dts(),
    ],
  },
]);
