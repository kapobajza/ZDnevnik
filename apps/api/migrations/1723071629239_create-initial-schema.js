const { createTable } = require("./util");

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  createTable(pgm, "users", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    first_name: {
      type: "varchar(255)",
    },
    last_name: {
      type: "varchar(255)",
    },
    username: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },
    password_hash: {
      type: "varchar",
      notNull: true,
    },
    password_salt: {
      type: "varchar",
      notNull: true,
    },
    avatar: {
      type: "varchar",
    },
    role: {
      type: "varchar(255)",
      notNull: true,
    },
    ordinal_number: {
      type: "integer",
    },
    average_grade: {
      type: "decimal",
      default: 0,
    },
  });

  createTable(pgm, "classrooms", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
  });

  createTable(pgm, "subjects", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    name: {
      type: "varchar(500)",
      notNull: true,
    },
    classroom_id: {
      type: "varchar",
      notNull: true,
    },
  });

  createTable(pgm, "users_grades", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    user_id: {
      type: "varchar",
      notNull: true,
    },
    subject_id: {
      type: "varchar",
      notNull: true,
    },
    grade: {
      type: "smallint",
      notNull: true,
    },
  });

  createTable(pgm, "users_classrooms", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    user_id: {
      type: "varchar",
      notNull: true,
    },
    classroom_id: {
      type: "varchar",
      notNull: true,
    },
  });

  pgm.addConstraint("users_classrooms", "fk_users_classrooms_user_id", {
    foreignKeys: {
      columns: ["user_id"],
      references: "users (id)",
    },
  });

  pgm.addConstraint("users_classrooms", "fk_users_classrooms_classroom_id", {
    foreignKeys: {
      columns: ["classroom_id"],
      references: "classrooms (id)",
    },
  });

  pgm.addConstraint("subjects", "fk_subjects_classroom_id", {
    foreignKeys: {
      columns: ["classroom_id"],
      references: "classrooms (id)",
    },
  });

  pgm.addConstraint("users_grades", "fk_users_grades_user_id", {
    foreignKeys: {
      columns: ["user_id"],
      references: "users (id)",
    },
  });

  pgm.addConstraint("users_grades", "fk_users_grades_subject_id", {
    foreignKeys: {
      columns: ["subject_id"],
      references: "subjects (id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
