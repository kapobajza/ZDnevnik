import { ClassroomModel } from "../features/clasrooms/classrooms.model";

import { UserClasroomModel } from "./models";
import { QueryBuilder } from "./queryBuilder";

import { UserModel } from "~/api/features/users/users.model";

describe("ORM query builder part", () => {
  let userQueryBuilder: QueryBuilder<typeof UserModel>;

  const formatSql = (sql: string) => sql.trim().replace(/\n\s+/g, " ");

  beforeEach(() => {
    userQueryBuilder = new QueryBuilder(UserModel);
  });

  it("select statement works correctly", () => {
    expect(userQueryBuilder.select().build()).toBe("SELECT * FROM users");
    expect(
      userQueryBuilder
        .select({
          avatar: UserModel.fields.Avatar,
        })
        .build(),
    ).toBe("SELECT users.avatar FROM users");
    expect(
      userQueryBuilder
        .select({
          id: UserModel.fields.Id,
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          date: {
            createdAt: UserModel.fields.CreatedAt,
            updatedAt: UserModel.fields.UpdatedAt,
          },
        })
        .build(),
    ).toBe(
      "SELECT users.id, users.first_name, users.last_name, users.created_at, users.updated_at FROM users",
    );
    expect(
      userQueryBuilder
        .select({
          id: UserModel.fields.Id,
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          classroomId: ClassroomModel.fields.Id,
        })
        .build(),
    ).toBe(
      "SELECT users.id, users.first_name, users.last_name, classrooms.id FROM users",
    );
  });

  it("where clause works correctly", () => {
    expect(
      userQueryBuilder
        .where({
          field: UserModel.fields.FirstName,
          operator: "=",
          value: "test",
        })
        .build(),
    ).toBe("SELECT * FROM users WHERE users.first_name = $1");
    expect(
      userQueryBuilder
        .select({
          id: UserModel.fields.Id,
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
        })
        .where({
          field: UserModel.fields.FirstName,
          operator: "!=",
          value: "test",
        })
        .build(),
    ).toBe(
      "SELECT users.id, users.first_name, users.last_name FROM users WHERE users.first_name != $1",
    );
    expect(
      userQueryBuilder
        .select()
        .where({
          field: ClassroomModel.fields.Name,
          operator: "=",
          value: "test",
        })
        .build(),
    ).toBe("SELECT * FROM users WHERE classrooms.name = $1");
  });

  it("insert statement works correctly", () => {
    expect(
      userQueryBuilder
        .insert([
          ["FirstName", "test"],
          ["LastName", "test2"],
        ])
        .build(),
    ).toBe(
      "INSERT INTO users(first_name, last_name) VALUES($1, $2) RETURNING *",
    );
    expect(
      userQueryBuilder
        .insert(
          [
            ["Id", "1"],
            ["Role", "teacher"],
          ],
          {
            returningFields: {
              id: UserModel.fields.Id,
              role: UserModel.fields.Role,
            },
          },
        )
        .build(),
    ).toBe("INSERT INTO users(id, role) VALUES($1, $2) RETURNING id, role");
  });

  it("should have different statements when build is used multiple times", () => {
    expect(
      userQueryBuilder
        .insert([
          ["Id", "1"],
          ["Role", "teacher"],
        ])
        .build(),
    ).toBe("INSERT INTO users(id, role) VALUES($1, $2) RETURNING *");
    expect(
      userQueryBuilder
        .select({
          createdAt: UserModel.fields.CreatedAt,
          avatar: UserModel.fields.Avatar,
        })
        .build(),
    ).toBe("SELECT users.created_at, users.avatar FROM users");
    expect(
      userQueryBuilder
        .select({
          createdAt: UserModel.fields.CreatedAt,
          avatar: UserModel.fields.Avatar,
        })
        .where({
          field: UserModel.fields.Id,
          operator: "=",
          value: "1",
        })
        .build(),
    ).toBe(
      "SELECT users.created_at, users.avatar FROM users WHERE users.id = $1",
    );
  });

  it("where with AND works correctly", () => {
    expect(
      userQueryBuilder
        .where({
          field: UserModel.fields.FirstName,
          operator: "=",
          value: "test",
        })
        .and({
          field: UserModel.fields.LastName,
          operator: "=",
          value: "test2",
        })
        .build(),
    ).toBe(
      "SELECT * FROM users WHERE users.first_name = $1 AND users.last_name = $2",
    );
  });

  it("where with OR works correctly", () => {
    expect(
      userQueryBuilder
        .where({
          field: UserModel.fields.FirstName,
          operator: "=",
          value: "test",
        })
        .or({
          field: UserModel.fields.LastName,
          operator: "=",
          value: "test2",
        })
        .build(),
    ).toBe(
      "SELECT * FROM users WHERE users.first_name = $1 OR users.last_name = $2",
    );
  });

  it("where with AND and OR works correctly", () => {
    expect(
      userQueryBuilder
        .where({
          field: UserModel.fields.FirstName,
          operator: "=",
          value: "test",
        })
        .and({
          field: UserModel.fields.LastName,
          operator: "=",
          value: "test2",
        })
        .or({
          field: UserModel.fields.LastName,
          operator: "=",
          value: "test3",
        })
        .build(),
    ).toBe(
      "SELECT * FROM users WHERE users.first_name = $1 AND users.last_name = $2 OR users.last_name = $3",
    );
  });

  it("multiple AND clauses should work correctly", () => {
    expect(
      userQueryBuilder
        .where({
          field: UserModel.fields.Id,
          operator: "=",
          value: "1",
        })
        .and({
          field: UserModel.fields.FirstName,
          operator: "=",
          value: "test2",
        })
        .and({
          field: UserModel.fields.LastName,
          operator: "=",
          value: "test3",
        })
        .build(),
    ).toBe(
      "SELECT * FROM users WHERE users.id = $1 AND users.first_name = $2 AND users.last_name = $3",
    );
  });

  it("sort by ASC works correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
        })
        .where({
          field: UserModel.fields.Id,
          operator: "=",
          value: "1",
        })
        .sort({
          by: [UserModel.fields.FirstName, UserModel.fields.LastName],
          order: "ASC",
        })
        .build(),
    ).toBe(
      "SELECT users.first_name, users.last_name FROM users WHERE users.id = $1 ORDER BY users.first_name, users.last_name ASC",
    );
  });

  it("sort by DESC works correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
        })
        .where({
          field: UserModel.fields.Id,
          operator: "=",
          value: "1",
        })
        .sort({
          by: [UserModel.fields.FirstName],
          order: "DESC",
        })
        .build(),
    ).toBe(
      "SELECT users.first_name, users.last_name FROM users WHERE users.id = $1 ORDER BY users.first_name DESC",
    );
  });

  it("limit works correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
        })
        .where({
          field: UserModel.fields.Id,
          operator: "=",
          value: "1",
        })
        .limit(10)
        .build(),
    ).toBe(
      "SELECT users.first_name, users.last_name FROM users WHERE users.id = $1 LIMIT 10",
    );
  });

  it("limit and offset works correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
        })
        .limit(10)
        .offset(10)
        .build(),
    ).toBe(
      formatSql(
        `
        SELECT users.first_name, users.last_name
        FROM users
        LIMIT 10
        OFFSET 10
        `,
      ),
    );
  });

  it("delete works correctly", () => {
    expect(userQueryBuilder.delete().build()).toBe("DELETE FROM users");
    expect(
      userQueryBuilder
        .delete()
        .where({ field: UserModel.fields.Id, operator: "=", value: "1" })
        .build(),
    ).toBe("DELETE FROM users WHERE users.id = $1");
  });

  it("join works correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          classroom: {
            id: UserClasroomModel.fields.ClassroomId,
          },
        })
        .join({
          type: "LEFT",
          table: UserClasroomModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .build(),
    ).toBe(
      formatSql(`
        SELECT users.first_name, users.last_name, users_classrooms.classroom_id
        FROM users
        LEFT JOIN users_classrooms ON users.id = users_classrooms.user_id
      `),
    );
  });

  it("join with where works correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          classroom: {
            id: UserClasroomModel.fields.ClassroomId,
          },
        })
        .join({
          type: "FULL",
          table: UserClasroomModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .where({
          field: UserClasroomModel.fields.UserId,
          operator: "=",
          value: "1",
        })
        .build(),
    ).toBe(
      formatSql(`
        SELECT users.first_name, users.last_name, users_classrooms.classroom_id
        FROM users
        FULL JOIN users_classrooms ON users.id = users_classrooms.user_id
        WHERE users_classrooms.user_id = $1
      `),
    );
  });

  it("multiple joins work correctly", () => {
    expect(
      userQueryBuilder
        .select({
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          classroom: {
            id: UserClasroomModel.fields.ClassroomId,
          },
        })
        .join({
          table: UserClasroomModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .join({
          table: ClassroomModel,
          on: {
            field: ClassroomModel.fields.Id,
            other: UserClasroomModel.fields.ClassroomId,
          },
        })
        .build(),
    ).toBe(
      formatSql(`
        SELECT users.first_name, users.last_name, users_classrooms.classroom_id
        FROM users
        INNER JOIN users_classrooms ON users.id = users_classrooms.user_id
        INNER JOIN classrooms ON classrooms.id = users_classrooms.classroom_id
      `),
    );
  });
});
