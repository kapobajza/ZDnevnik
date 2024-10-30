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
  createTable(pgm, "invite_tokens", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
    },
    token: {
      type: "varchar(255)",
      notNull: true,
    },
    token_salt: {
      type: "varchar(255)",
      notNull: true,
    },
    expires_at: {
      type: "timestamp",
      notNull: true,
    },
    status: {
      type: "varchar(50)",
    },
    classroom_id: {
      type: "varchar",
      notNull: true,
    },
  });

  pgm.addConstraint("invite_tokens", "fk_invite_tokens_classroom_id", {
    foreignKeys: {
      columns: ["classroom_id"],
      references: "classrooms (id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
