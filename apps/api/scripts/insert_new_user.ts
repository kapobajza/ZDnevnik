import crypto from "crypto";

import { Pool } from "pg";
import yargs from "yargs";

import { UserRole } from "../features/users/user.types";

import { mapTables } from "~/api/db/util";
import { ModelORM } from "~/api/db/orm";
import { UserModel } from "~/api/features/users/users.model";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";

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

  const udid = [8, 4, 4, 4, 12]
    .map((n) => crypto.randomBytes(n / 2).toString("hex"))
    .join("-");

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
