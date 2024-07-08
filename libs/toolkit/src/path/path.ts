import { spawnSync } from "child_process";
import path from "path";
import type { ProjectName } from "~/toolkit/types/project.types";

export const getRootPath = () =>
  spawnSync("git", ["rev-parse", "--show-toplevel"]).stdout.toString().trim();

export const getRelativeMonoRepoPath = (projectPath: ProjectName) =>
  path.join(getRootPath(), "packages", projectPath);
