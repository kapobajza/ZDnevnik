const { defineConfig } = require("rollup");
const typescript = require("@rollup/plugin-typescript");
const { dts } = require("rollup-plugin-dts");
const alias = require("@rollup/plugin-alias");
const path = require("path");

const generateConfig = ({ input, output }) => [
  {
    input,
    output: [
      {
        file: `${output}/toolkit.cjs.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${output}/toolkit.es.js`,
        format: "es",
        sourcemap: true,
      },
    ],
    external: ["yaml", "tsx"],
    plugins: [
      alias({
        entries: {
          "~/toolkit": path.resolve("./src"),
          "~/scripting": path.resolve("./scripting"),
        },
      }),
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  },
  {
    input: `${output}/index.d.ts`,
    output: [{ file: `${output}/index.d.ts`, format: "es" }],
    plugins: [
      alias({
        entries: {
          "~/toolkit": path.resolve("./dist/main/src"),
          "~/scripting": path.resolve("./dist/scripting"),
        },
      }),
      dts(),
    ],
  },
];

module.exports = defineConfig([
  ...generateConfig({ input: "src/index.ts", output: "dist/main" }),
  ...generateConfig({ input: "scripting/index.ts", output: "dist/scripting" }),
]);
