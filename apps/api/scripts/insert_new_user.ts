import { Pool } from "pg";
import yargs from "yargs";
import { UserModel, UserRole } from "@zdnevnik/toolkit";

import { mapTables } from "~/api/db/util";
import { ModelORM } from "~/api/db/orm";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";
import { generateUdid } from "~/api/util/udid";

const args = process.argv.slice(2);

const argv = yargs(args).option({
  databaseUrl: {
    type: "string",
    alias: "du",
    demandOption: true,
  },
  username: {
    type: "string",
    alias: "u",
    demandOption: true,
  },
  password: {
    type: "string",
    alias: "p",
    demandOption: true,
  },
}).argv;

const pool = new Pool({
  connectionString: argv.databaseUrl,
});

const main = async () => {
  const mappedTables = await mapTables(pool);
  const userTable = new ModelORM(UserModel, pool, mappedTables);

  const passwordSalt = generatePasswordSalt();
  const passwordHash = hashPassword(argv.password, passwordSalt);

  const udid = generateUdid();

  const res = await userTable
    .insert([
      ["Id", udid],
      ["Username", argv.username],
      ["PasswordHash", passwordHash],
      ["PasswordSalt", passwordSalt],
      ["FirstName", "First"],
      ["LastName", "User"],
      ["Role", UserRole.Teacher],
    ])
    .execute();

  console.log("User created ", res);
};

void main();
