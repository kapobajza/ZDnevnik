import { Pool } from "pg";
import { UserModel } from "./models";
import { ModelORM } from "./orm";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import Postgrator from "postgrator";
import path from "path";
import { getRelativeMonoRepoPath } from "@zdnevnik/toolkit";

describe("ORM tests", () => {
  // jest.setTimeout(60000);
  jest.setTimeout(10000);

  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Pool;
  let usersTable: ModelORM<typeof UserModel>;
  const USER_ID = "1";

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    const connectionString = postgresContainer.getConnectionUri();
    postgresClient = new Pool({
      connectionString,
    });
    const client = await postgresClient.connect();

    const database = "zdnevnik_test";
    await postgresClient.query(`CREATE DATABASE ${database}`);

    const postgrator = new Postgrator({
      migrationPattern: `${path.join(getRelativeMonoRepoPath("api"), "migrations", "sql")}/*`,
      driver: "pg",
      database,
      execQuery: (query) => postgresClient.query(query),
    });

    await postgrator.migrate();

    usersTable = new ModelORM(UserModel, postgresClient);

    await usersTable.transaction(async (tx) => {
      await tx
        .insert(["id", "first_name", "last_name"], [USER_ID, "test", "test"])
        .execute();

      await tx
        .insert(["id", "first_name", "last_name"], ["2", "test 2", "test 2"], {
          returningFields: ["id", "first_name", "last_name"],
        })
        .execute();
    });

    client.release();
  });

  afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  it("select should select values from table", async () => {
    const result = await usersTable
      .select("first_name", "last_name", "id")
      .executeOne();

    expect(result).toEqual({
      first_name: "test",
      last_name: "test",
      id: "1",
    });
  });

  it("select with where clause should select values from table", async () => {
    const result = await usersTable
      .select("first_name", "last_name")
      .where({
        field: "id",
        operator: "=",
        value: USER_ID,
      })
      .executeOne();

    expect(result).toEqual({ first_name: "test", last_name: "test" });
  });

  it("select with where clause and AND clause should select values from table", async () => {
    const result = await usersTable
      .select("first_name", "last_name")
      .where({
        field: "id",
        operator: "=",
        value: USER_ID,
      })
      .and({
        field: "first_name",
        operator: "=",
        value: "test",
      })
      .executeOne();

    expect(result).toEqual({ first_name: "test", last_name: "test" });
  });

  it("select with multiple AND statements should select values from table", async () => {
    const result = await usersTable
      .select("first_name", "last_name")
      .where({
        field: "id",
        operator: "=",
        value: USER_ID,
      })
      .and({
        field: "first_name",
        operator: "=",
        value: "test",
      })
      .and({
        field: "last_name",
        operator: "=",
        value: "test",
      })
      .executeOne();

    expect(result).toEqual({ first_name: "test", last_name: "test" });
  });

  it("sort by ASC works correctly", async () => {
    const result = await usersTable
      .select("id")
      .sort({
        by: ["id"],
        order: "ASC",
      })
      .execute();

    expect(result).toEqual([{ id: "1" }, { id: "2" }]);
  });

  it("sort by DESC works correctly", async () => {
    const result = await usersTable
      .select("id")
      .sort({
        by: ["id"],
        order: "DESC",
      })
      .execute();

    expect(result).toEqual([{ id: "2" }, { id: "1" }]);
  });

  it("limit works correctly", async () => {
    const result = await usersTable.select("id").limit(1).execute();

    expect(result).toEqual([{ id: "1" }]);
  });

  it("offset works correctly", async () => {
    const result = await usersTable.select("id").offset(1).execute();

    expect(result).toEqual([{ id: "2" }]);
  });

  it("insert should insert values into table", async () => {
    const userId = "3";
    const result = await usersTable
      .insert(["id", "first_name", "last_name"], [userId, "test 3", "test 3"], {
        returningFields: ["id", "first_name", "last_name"],
      })
      .executeOne();

    expect(result).toEqual({
      id: "3",
      first_name: "test 3",
      last_name: "test 3",
    });
  });
});
