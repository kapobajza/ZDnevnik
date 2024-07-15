import { UserModel } from "./models";
import { QueryBuilder } from "./queryBuilder";

describe("ORM query builder part", () => {
  let userQueryBuilder: QueryBuilder<typeof UserModel>;

  beforeEach(() => {
    userQueryBuilder = new QueryBuilder(UserModel);
  });

  it("select statement works correctly", () => {
    expect(userQueryBuilder.build()).toBe("SELECT * FROM users");
    expect(userQueryBuilder.select("avatar").build()).toBe(
      "SELECT avatar FROM users",
    );
    expect(
      userQueryBuilder.select("id", "first_name", "last_name").build(),
    ).toBe("SELECT id, first_name, last_name FROM users");
  });

  it("where clause works correctly", () => {
    expect(
      userQueryBuilder
        .where({
          field: "first_name",
          operator: "=",
          value: "test",
        })
        .build(),
    ).toBe("SELECT * FROM users WHERE first_name = $1");
    expect(
      userQueryBuilder
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
      userQueryBuilder
        .insert(["first_name", "last_name"], ["test", "test2"])
        .build(),
    ).toBe(
      "INSERT INTO users(first_name, last_name) VALUES($1, $2) RETURNING *",
    );
  });

  it("should have different statements when build is used multiple times", () => {
    expect(
      userQueryBuilder.insert(["id", "role"], ["1", "teacher"]).build(),
    ).toBe("INSERT INTO users(id, role) VALUES($1, $2) RETURNING *");
    expect(userQueryBuilder.select("created_at", "avatar").build()).toBe(
      "SELECT created_at, avatar FROM users",
    );
    expect(
      userQueryBuilder
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
      userQueryBuilder
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
      userQueryBuilder
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
      userQueryBuilder
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
      userQueryBuilder
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
      userQueryBuilder
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
      userQueryBuilder
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

  it("limit works correctly", () => {
    expect(
      userQueryBuilder
        .select("first_name", "last_name")
        .where({
          field: "id",
          operator: "=",
          value: "1",
        })
        .limit(10)
        .build(),
    ).toBe("SELECT first_name, last_name FROM users WHERE id = $1 LIMIT 10");
  });

  it("limit and offset works correctly", () => {
    expect(
      userQueryBuilder
        .select("first_name", "last_name")
        .limit(10)
        .offset(10)
        .build(),
    ).toBe("SELECT first_name, last_name FROM users LIMIT 10 OFFSET 10");
  });

  it("delete works correctly", () => {
    expect(userQueryBuilder.delete().build()).toBe("DELETE FROM users");
  });
});