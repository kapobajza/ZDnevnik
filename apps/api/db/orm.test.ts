import type { Pool } from "pg";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

import { ModelORM } from "./orm";
import { UserClasroomModel } from "./models";
import { mapTables } from "./util";

import { setupPgTestDatabase } from "~/api/test/util";
import { UserModel } from "~/api/features/users/users.model";
import { ClassroomModel } from "~/api/features/clasrooms/classrooms.model";

describe("ORM tests", () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Pool;
  let usersTable: ModelORM<typeof UserModel>;
  let userClasroomTable: ModelORM<typeof UserClasroomModel>;
  let clasroomTable: ModelORM<typeof ClassroomModel>;
  const USER_ID = "1";

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
          ["Id", USER_ID],
          ["FirstName", "test"],
          ["LastName", "test"],
        ])
        .execute();

      await tx
        .insert([
          ["Id", "2"],
          ["FirstName", "test 2"],
          ["LastName", "test 2"],
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
          createdAt: null,
          updatedAt: null,
        },
      },
      userId: "1",
    });
  });

  it("select should select all values from table", async () => {
    const result = await usersTable.select().executeOne();

    expect(result).toEqual({
      avatar: null,
      average_grade: null,
      created_at: null,
      first_name: "test",
      id: "1",
      last_name: "test",
      ordinal_number: null,
      password_hash: null,
      password_salt: null,
      role: null,
      updated_at: null,
      username: null,
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
      ])
      .execute();
    await userClasroomTable
      .insert([
        ["Id", "user_classroom_1"],
        ["UserId", "2"],
        ["ClassroomId", "clasroom_1"],
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
          average_grade: null,
          created_at: null,
          first_name: "test 2",
          id: "2",
          last_name: "test 2",
          ordinal_number: null,
          password_hash: null,
          password_salt: null,
          role: null,
          updated_at: null,
          username: null,
        },
        users_classrooms: {
          classroom_id: "clasroom_1",
          created_at: null,
          id: "user_classroom_1",
          updated_at: null,
          user_id: "2",
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

    expect(result).toEqual({
      id: "3",
      first_name: "test 3",
      last_name: "test 3",
    });
  });
});
