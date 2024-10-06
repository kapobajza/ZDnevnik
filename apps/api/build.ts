import * as esbuild from "esbuild";
import { glob } from "glob";

void (async () => {
  const entryPoints = await glob("src/**/*.ts");

  await esbuild.build({
    entryPoints,
    bundle: true,
    outdir: "dist",
    platform: "node",
    external: ["sodium-native", "sharp"],
    loader: {
      ".node": "file",
    },
  });

  console.log("Build complete!");
})();
