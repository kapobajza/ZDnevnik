import { Pool } from "pg";
import yargs from "yargs";
import {
  ClassroomModel,
  UserClasroomModel,
  UserModel,
  UserRole,
} from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { generateUdid } from "./util";

import { mapTables } from "~/api/db/util";
import { ModelORM } from "~/api/db/orm";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";

const args = process.argv.slice(2);

const argv = yargs(args).option({
  databaseUrl: {
    type: "string",
    alias: "du",
    demandOption: true,
  },
  teacher: {
    type: "string",
    alias: "t",
    demandOption: true,
  },
  classroom: {
    type: "string",
    alias: "c",
    demandOption: true,
  },
}).argv;

const pool = new Pool({
  connectionString: argv.databaseUrl,
});

const main = async () => {
  const mappedTables = await mapTables(pool);
  const userTable = new ModelORM(UserModel, pool, mappedTables);
  const userClasroomTable = new ModelORM(UserClasroomModel, pool, mappedTables);
  const classroomTable = new ModelORM(ClassroomModel, pool, mappedTables);

  const classroom = await classroomTable
    .insert([
      ["Id", generateUdid()],
      ["Name", argv.classroom],
    ])
    .executeOne();

  invariant(classroom, "Classroom not created");

  const teacher = await userTable
    .select({
      id: UserModel.fields.Id,
    })
    .where({
      field: UserModel.fields.Username,
      operator: "=",
      value: argv.teacher,
    })
    .executeOne();

  invariant(teacher, "Teacher not found");

  await userClasroomTable
    .insert([
      ["Id", generateUdid()],
      ["UserId", teacher.id],
      ["ClassroomId", classroom.id],
      ["IsTeacher", true],
    ])
    .execute();

  for (let i = 0; i < 50; i++) {
    const userUdid = generateUdid();

    const passwordSalt = generatePasswordSalt();
    const passwordHash = hashPassword("Test1234", passwordSalt);

    try {
      const user = await userTable
        .insert([
          ["Id", userUdid],
          ["Username", `student${i + 1}`],
          ["PasswordHash", passwordHash],
          ["PasswordSalt", passwordSalt],
          ["FirstName", "Student"],
          ["LastName", i + 1],
          ["Role", UserRole.Student],
          ["OrdinalNumber", i + 1],
        ])
        .executeOne();

      invariant(user, "User not created");

      await userClasroomTable
        .insert([
          ["Id", generateUdid()],
          ["UserId", user.id],
          ["ClassroomId", classroom.id],
        ])
        .execute();

      console.log("User created ", user.first_name, user.last_name);
    } catch (err) {
      console.log("An error occurred: ", err);
    }
  }
};

void main();