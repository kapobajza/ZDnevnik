import type { Pool } from "pg";
import { describe, beforeAll, expect, it, afterAll } from "vitest";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import * as DateFns from "date-fns";
import {
  UserClasroomModel,
  UserModel,
  ClassroomModel,
  UserRole,
} from "@zdnevnik/toolkit";

import { ModelORM } from "./orm";
import { mapTables } from "./util";

import { setupPgTestDatabase } from "~/api/test/util";

describe("ORM tests", () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Pool;
  let usersTable: ModelORM<typeof UserModel>;
  let userClasroomTable: ModelORM<typeof UserClasroomModel>;
  let clasroomTable: ModelORM<typeof ClassroomModel>;
  const now = new Date();
  const createdAtDate = DateFns.format(now, "yyyy-MM-dd HH:mm:ss");
  const createdAtTimestamp = DateFns.parse(
    createdAtDate,
    "yyyy-MM-dd HH:mm:ss",
    now,
  ).getTime();
  const USER_ID = "1";
  const userCommon: Pick<
    UserModel,
    | "id"
    | "password_hash"
    | "password_salt"
    | "role"
    | "created_at"
    | "updated_at"
  > & {
    created_at_date: string;
    updated_at_date: string;
  } = {
    id: "1",
    password_hash: "test",
    password_salt: "test",
    role: "test",
    created_at: createdAtTimestamp,
    updated_at: createdAtTimestamp,
    created_at_date: createdAtDate,
    updated_at_date: createdAtDate,
  };

  beforeAll(async () => {
    const pgContent = await setupPgTestDatabase();

    postgresContainer = pgContent.postgresContainer;
    postgresClient = pgContent.postgresClient;
    const mappedTable = await mapTables(postgresClient);

    usersTable = new ModelORM(UserModel, postgresClient, mappedTable);
    userClasroomTable = new ModelORM(
      UserClasroomModel,
      postgresClient,
      mappedTable,
    );
    clasroomTable = new ModelORM(ClassroomModel, postgresClient, mappedTable);

    await usersTable.transaction(async (tx) => {
      await tx
        .insert([
          ["FirstName", "test"],
          ["LastName", "test"],
          ["Username", "test"],
          ["Id", userCommon.id],
          ["PasswordHash", userCommon.password_hash],
          ["PasswordSalt", userCommon.password_salt],
          ["Role", userCommon.role],
          ["CreatedAt", createdAtDate],
          ["UpdatedAt", createdAtDate],
        ])
        .execute();

      await tx
        .insert([
          ["Id", "2"],
          ["FirstName", "test 2"],
          ["LastName", "test 2"],
          ["Username", "test2"],
          ["PasswordHash", userCommon.password_hash],
          ["PasswordSalt", userCommon.password_salt],
          ["Role", userCommon.role],
          ["CreatedAt", createdAtDate],
          ["UpdatedAt", createdAtDate],
        ])
        .execute();
    });
  });

  afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  it("select should select specifc values from table", async () => {
    const result = await usersTable
      .select({
        userId: UserModel.fields.Id,
        firstName: UserModel.fields.FirstName,
        lastName: UserModel.fields.LastName,
      })
      .executeOne();

    expect(result).toEqual({
      firstName: "test",
      lastName: "test",
      userId: "1",
    });
  });

  it("select should select specifc nested values from table", async () => {
    const result = await usersTable
      .select({
        userId: UserModel.fields.Id,
        name: {
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          date: {
            createdAt: UserModel.fields.CreatedAt,
            updatedAt: UserModel.fields.UpdatedAt,
          },
        },
      })
      .executeOne();

    expect(result).toEqual({
      name: {
        firstName: "test",
        lastName: "test",
        date: {
          createdAt: userCommon.created_at,
          updatedAt: userCommon.updated_at,
        },
      },
      userId: "1",
    });
  });

  it("select should select all values from table", async () => {
    const result = await usersTable.select().executeOne();

    expect(result).toStrictEqual({
      avatar: null,
      average_grade: 0,
      first_name: "test",
      id: "1",
      last_name: "test",
      ordinal_number: null,
      password_hash: userCommon.password_hash,
      password_salt: userCommon.password_salt,
      role: userCommon.role,
      created_at: userCommon.created_at,
      updated_at: userCommon.updated_at,
      username: "test",
    });
  });

  it("select with where clause should select values from table", async () => {
    const result = await usersTable
      .select({
        first_name: UserModel.fields.FirstName,
        last_name: UserModel.fields.LastName,
      })
      .where({
        field: UserModel.fields.Id,
        operator: "=",
        value: USER_ID,
      })
      .executeOne();

    expect(result).toEqual({ first_name: "test", last_name: "test" });
  });

  it("select with where clause and AND clause should select values from table", async () => {
    const result = await usersTable
      .select({
        first_name: UserModel.fields.FirstName,
        last_name: UserModel.fields.LastName,
      })
      .where({
        field: UserModel.fields.Id,
        operator: "=",
        value: USER_ID,
      })
      .and({
        field: UserModel.fields.FirstName,
        operator: "=",
        value: "test",
      })
      .executeOne();

    expect(result).toEqual({ first_name: "test", last_name: "test" });
  });

  it("select with multiple AND statements should select values from table", async () => {
    const result = await usersTable
      .select({
        first_name: UserModel.fields.FirstName,
        last_name: UserModel.fields.LastName,
      })
      .where({
        field: UserModel.fields.Id,
        operator: "=",
        value: USER_ID,
      })
      .and({
        field: UserModel.fields.FirstName,
        operator: "=",
        value: "test",
      })
      .and({
        field: UserModel.fields.LastName,
        operator: "=",
        value: "test",
      })
      .executeOne();

    expect(result).toEqual({ first_name: "test", last_name: "test" });
  });

  it("sort by ASC works correctly", async () => {
    const result = await usersTable
      .select({
        id: UserModel.fields.Id,
      })
      .sort({
        by: [UserModel.fields.Id],
        order: "ASC",
      })
      .execute();

    expect(result).toEqual([{ id: "1" }, { id: "2" }]);
  });

  it("sort by DESC works correctly", async () => {
    const result = await usersTable
      .select({
        id: UserModel.fields.Id,
      })
      .sort({
        by: [UserModel.fields.Id],
        order: "DESC",
      })
      .execute();

    expect(result).toEqual([{ id: "2" }, { id: "1" }]);
  });

  it("limit works correctly", async () => {
    const result = await usersTable
      .select({ id: UserModel.fields.Id })
      .limit(1)
      .execute();

    expect(result).toEqual([{ id: "1" }]);
  });

  it("offset works correctly", async () => {
    const result = await usersTable
      .select({ id: UserModel.fields.Id })
      .offset(1)
      .execute();

    expect(result).toEqual([{ id: "2" }]);
  });

  it("join works correctly", async () => {
    await clasroomTable
      .insert([
        ["Id", "clasroom_1"],
        ["Name", "clasroom_test"],
        ["CreatedAt", createdAtDate],
        ["UpdatedAt", createdAtDate],
      ])
      .execute();
    await userClasroomTable
      .insert([
        ["Id", "user_classroom_1"],
        ["UserId", "2"],
        ["ClassroomId", "clasroom_1"],
        ["CreatedAt", createdAtDate],
        ["UpdatedAt", createdAtDate],
      ])
      .execute();
    const result = await usersTable
      .select()
      .join({
        table: UserClasroomModel,
        on: {
          field: UserModel.fields.Id,
          other: UserClasroomModel.fields.UserId,
        },
      })
      .execute();

    expect(result).toEqual([
      {
        users: {
          avatar: null,
          average_grade: 0,
          created_at: createdAtTimestamp,
          first_name: "test 2",
          id: "2",
          last_name: "test 2",
          ordinal_number: null,
          password_hash: "test",
          password_salt: "test",
          role: "test",
          updated_at: createdAtTimestamp,
          username: "test2",
        },
        users_classrooms: {
          classroom_id: "clasroom_1",
          created_at: createdAtTimestamp,
          id: "user_classroom_1",
          updated_at: createdAtTimestamp,
          user_id: "2",
          is_teacher: null,
        },
      },
    ]);
  });

  it("join with specific select fields works correctly", async () => {
    const result = await usersTable
      .select({
        id: UserModel.fields.Id,
        first_name: UserModel.fields.FirstName,
        last_name: UserModel.fields.LastName,
        user_classroom_id: UserClasroomModel.fields.Id,
      })
      .join({
        table: UserClasroomModel,
        on: {
          field: UserModel.fields.Id,
          other: UserClasroomModel.fields.UserId,
        },
      })
      .execute();

    expect(result).toEqual([
      {
        id: "2",
        first_name: "test 2",
        last_name: "test 2",
        user_classroom_id: "user_classroom_1",
      },
    ]);
  });

  it("insert should insert values into table", async () => {
    const userId = "3";
    const result = await usersTable
      .insert(
        [
          ["Id", userId],
          ["FirstName", "test 3"],
          ["LastName", "test 3"],
          ["Username", "test3"],
          ["PasswordHash", "test"],
          ["PasswordSalt", "test"],
          ["Role", "test"],
        ],
        {
          returningFields: {
            id: UserModel.fields.Id,
            first_name: UserModel.fields.FirstName,
            last_name: UserModel.fields.LastName,
          },
        },
      )
      .executeOne();

    await usersTable
      .insert([
        ["FirstName", "test 3"],
        ["LastName", "test 3"],
        ["OrdinalNumber", null],
        ["Role", UserRole.Student],
        ["AverageGrade", 0.0],
        ["Avatar", null],
        ["PasswordHash", "test"],
        ["PasswordSalt", "test"],
        ["Id", "sadsadsa"],
        ["Username", "sadsdsaxxxx"],
      ])
      .executeOne();

    expect(result).toEqual({
      id: "3",
      first_name: "test 3",
      last_name: "test 3",
    });
  });
});
