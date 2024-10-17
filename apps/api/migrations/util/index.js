/**
 * @typedef {Parameters<import('node-pg-migrate').MigrationBuilder['createTable']>} CreateTableParams
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param tableName {CreateTableParams[0]}
 * @param columns {CreateTableParams[1]}
 * @param options {CreateTableParams[2]}
 */
exports.createTable = (pgm, tableName, columns, options) => {
  return pgm.createTable(
    tableName,
    {
      ...columns,
      created_at: {
        type: "timestamp",
        notNull: true,
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
      },
    },
    options,
  );
};
