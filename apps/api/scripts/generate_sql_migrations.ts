import { getRelativeMonoRepoPath } from "@zdnevnik/toolkit";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const generateSqlMigrations = () => {
  const apiPath = getRelativeMonoRepoPath("api");
  const migrationsPath = path.join(apiPath, "migrations");
  const migrationTsFiles = fs.readdirSync(migrationsPath);

  for (const migrationTsFile of migrationTsFiles) {
    const migrationTsFilePath = path.join(migrationsPath, migrationTsFile);

    if (fs.statSync(migrationTsFilePath).isFile()) {
      const sqlContent = spawnSync("npx", [
        "tsx",
        "-e",
        `import generateSql from '${migrationTsFilePath}'; console.log(generateSql());`,
      ]);

      fs.writeFileSync(
        path.join(
          migrationsPath,
          "sql",
          `${migrationTsFile.replace(".ts", "")}.sql`,
        ),
        sqlContent.stdout.toString().trim(),
      );
    }
  }
};

generateSqlMigrations();
