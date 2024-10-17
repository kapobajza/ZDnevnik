import { Pool } from "pg";
import yargs from "yargs";
import {
  ClassroomModel,
  UserClasroomModel,
  UserModel,
  UserRole,
} from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { mapTables } from "~/api/db/util";
import { ModelORM } from "~/api/db/orm";
import { generateSecureString, securelyHashString } from "~/api/util/secure";
import { generateUdid } from "~/api/util/udid";

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
  empty: {
    type: "boolean",
    default: false,
  },
}).argv;

const main = async () => {
  const pool = new Pool({
    connectionString: argv.databaseUrl,
  });

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

  if (!argv.empty) {
    for (let i = 0; i < 50; i++) {
      const userUdid = generateUdid();

      const passwordSalt = generateSecureString();
      const passwordHash = securelyHashString("Test1234", passwordSalt);
      const randomGrade = Math.random() * 5;

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
            ["AverageGrade", randomGrade],
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
  }
};

void main();
