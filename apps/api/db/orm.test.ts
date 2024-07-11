import { Client } from "pg";
import { UserModel } from "./models";
import { createModelORM, type ModelORM } from "./orm";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import Postgrator from "postgrator";
import path from "path";
import { getRelativeMonoRepoPath } from "@zdnevnik/toolkit";

describe("ORM query builder part", () => {
  let userDb: ModelORM<typeof UserModel>;

  beforeEach(() => {
    userDb = createModelORM(UserModel, new Client());
  });

  it("select statement works correctly", () => {
    expect(userDb.build()).toBe("SELECT * FROM users");
    expect(userDb.select("avatar").build()).toBe("SELECT avatar FROM users");
    expect(userDb.select("id", "first_name", "last_name").build()).toBe(
      "SELECT id, first_name, last_name FROM users",
    );
  });

  it("where clause works correctly", () => {
    expect(
      userDb
        .where({
          field: "first_name",
          operator: "=",
          value: "test",
        })
        .build(),
    ).toBe("SELECT * FROM users WHERE first_name = $1");
    expect(
      userDb
        .select("id", "first_name", "last_name")
        .where({
          field: "first_name",
          operator: "!=",
          value: "test",
        })
        .build(),
    ).toBe(
      "SELECT id, first_name, last_name FROM users WHERE first_name != $1",
    );
  });

  it("insert statement works correctly", () => {
    expect(
      userDb.insert(["first_name", "last_name"], ["test", "test2"]).build(),
    ).toBe(
      "INSERT INTO users(first_name, last_name) VALUES($1, $2) RETURNING *",
    );
  });

  it("should have different statements when build is used multiple times", () => {
    expect(userDb.insert(["id", "role"], ["1", "teacher"]).build()).toBe(
      "INSERT INTO users(id, role) VALUES($1, $2) RETURNING *",
    );
    expect(userDb.select("created_at", "avatar").build()).toBe(
      "SELECT created_at, avatar FROM users",
    );
    expect(
      userDb
        .select("created_at", "avatar")
        .where({
          field: "id",
          operator: "=",
          value: "1",
        })
        .build(),
    ).toBe("SELECT created_at, avatar FROM users WHERE id = $1");
  });

  it("where with AND works correctly", () => {
    expect(
      userDb
        .where({
          field: "first_name",
          operator: "=",
          value: "test",
        })
        .and({
          field: "last_name",
          operator: "=",
          value: "test2",
        })
        .build(),
    ).toBe("SELECT * FROM users WHERE first_name = $1 AND last_name = $2");
  });

  it("where with OR works correctly", () => {
    expect(
      userDb
        .where({
          field: "first_name",
          operator: "=",
          value: "test",
        })
        .or({
          field: "last_name",
          operator: "=",
          value: "test2",
        })
        .build(),
    ).toBe("SELECT * FROM users WHERE first_name = $1 OR last_name = $2");
  });

  it("where with AND and OR works correctly", () => {
    expect(
      userDb
        .where({
          field: "first_name",
          operator: "=",
          value: "test",
        })
        .and({
          field: "last_name",
          operator: "=",
          value: "test2",
        })
        .or({
          field: "last_name",
          operator: "=",
          value: "test3",
        })
        .build(),
    ).toBe(
      "SELECT * FROM users WHERE first_name = $1 AND last_name = $2 OR last_name = $3",
    );
  });

  it("multiple AND clauses should work correctly", () => {
    expect(
      userDb
        .where({
          field: "id",
          operator: "=",
          value: "1",
        })
        .and({
          field: "first_name",
          operator: "=",
          value: "test2",
        })
        .and({
          field: "last_name",
          operator: "=",
          value: "test3",
        })
        .build(),
    ).toBe(
      "SELECT * FROM users WHERE id = $1 AND first_name = $2 AND last_name = $3",
    );
  });

  it("sort by ASC works correctly", () => {
    expect(
      userDb
        .select("first_name", "last_name")
        .where({
          field: "id",
          operator: "=",
          value: "1",
        })
        .sort({
          by: ["first_name", "last_name"],
          order: "ASC",
        })
        .build(),
    ).toBe(
      "SELECT first_name, last_name FROM users WHERE id = $1 ORDER BY first_name, last_name ASC",
    );
  });

  it("sort by DESC works correctly", () => {
    expect(
      userDb
        .select("first_name", "last_name")
        .where({
          field: "id",
          operator: "=",
          value: "1",
        })
        .sort({
          by: ["first_name"],
          order: "DESC",
        })
        .build(),
    ).toBe(
      "SELECT first_name, last_name FROM users WHERE id = $1 ORDER BY first_name DESC",
    );
  });
});

describe("ORM tests", () => {
  jest.setTimeout(60000);

  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;
  let usersTable: ModelORM<typeof UserModel>;
  const USER_ID = "1";

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    const connectionString = postgresContainer.getConnectionUri();
    postgresClient = new Client({
      connectionString,
    });
    await postgresClient.connect();

    const database = "zdnevnik_test";
    await postgresClient.query(`CREATE DATABASE ${database}`);

    const postgrator = new Postgrator({
      migrationPattern: `${path.join(getRelativeMonoRepoPath("api"), "migrations", "sql")}/*`,
      driver: "pg",
      database,
      execQuery: (query) => postgresClient.query(query),
    });

    await postgrator.migrate();

    usersTable = createModelORM(UserModel, postgresClient);
    await usersTable
      .insert(["id", "first_name", "last_name"], [USER_ID, "test", "test"])
      .execute();
  });

  afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  it("insert should insert values into table", async () => {
    const userId = "2";
    const result = await usersTable
      .insert(["id", "first_name", "last_name"], [userId, "test", "test"], {
        returningFields: ["id", "first_name", "last_name"],
      })
      .executeOne();

    expect(result).toEqual({ id: "2", first_name: "test", last_name: "test" });
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
});
