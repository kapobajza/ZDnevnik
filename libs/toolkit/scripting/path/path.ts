import { spawnSync } from "child_process";
import path from "path";

import type { ProjectName } from "~/scripting/types/project.types";

export const getRootPath = () =>
  spawnSync("git", ["rev-parse", "--show-toplevel"]).stdout.toString().trim();

export const getRelativeMonoRepoPath = (projectPath: ProjectName) => {
  const projectPrefixPath: Record<ProjectName, "apps" | "libs"> = {
    api: "apps",
    toolkit: "libs",
    sveltastic: "apps",
  };

  return path.join(getRootPath(), projectPrefixPath[projectPath], projectPath);
};
