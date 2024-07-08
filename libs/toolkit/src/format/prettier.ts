import path from "path";

import { spawnSync } from "child_process";
import prettier from "prettier";
import { getRootPath } from "~/toolkit/path";

export const applyPrettier = (path: string) => {
  return spawnSync("npx", ["prettier", "--write", path], { stdio: "inherit" });
};

export const prettierFormatted = async (text: string, src: string) => {
  const prettierOptions = await prettier.resolveConfig(
    path.join(getRootPath(), ".prettierrc.js"),
  );

  return prettier.format(text, {
    ...prettierOptions,
    filepath: src,
  });
};
