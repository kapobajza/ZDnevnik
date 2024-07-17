import type {
  ConditionalClause,
  IQueryBuilder,
  InferModelField,
  InsertOptions,
  QueryBuilderState,
  SortingOptions,
  ModelSchema,
  JoinOptions,
} from "./types";

export class QueryBuilder<
  TModel extends ModelSchema,
  TModelFields extends (keyof InferModelField<
    TModel["fields"]
  >)[] = (keyof InferModelField<TModel["fields"]>)[],
> implements IQueryBuilder<TModel, TModelFields>
{
  state: Partial<QueryBuilderState<TModel>> = {};

  constructor(private model: TModel) {}

  cloneAndUpdate = (update: Partial<QueryBuilderState<TModel>>) => {
    const newState = {
      ...this.state,
      ...update,
    };

    for (const [key, value] of Object.entries(update)) {
      const updateKey = key as keyof QueryBuilderState<TModel>;
      const currentState = this.state[updateKey];

      if (!value) {
        continue;
      }

      if (Array.isArray(value)) {
        newState[updateKey] = [
          ...((currentState ?? []) as Array<object>),
          ...value,
        ] as never;
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        newState[updateKey] = {
          ...(currentState as object),
          ...value,
        } as never;
      }
    }

    return new QueryBuilder(this.model).setState(newState);
  };

  private setState(newState: Partial<QueryBuilderState<TModel>>) {
    this.state = newState;
    return this;
  }

  select(...columns: TModelFields) {
    return this.cloneAndUpdate({
      selectColumns:
        columns.length === 0
          ? undefined
          : columns
              .map((column) => `${this.model.name}.${column as string}`)
              .join(", "),
    });
  }

  where(clause: ConditionalClause<TModel>) {
    return this.cloneAndUpdate({ whereClause: clause });
  }

  and(clause: ConditionalClause<TModel>) {
    return this.cloneAndUpdate({
      additionalClauses: [
        {
          ...clause,
          type: "AND",
        },
      ],
    });
  }

  or(clause: ConditionalClause<TModel>) {
    return this.cloneAndUpdate({
      additionalClauses: [
        {
          ...clause,
          type: "OR",
        },
      ],
    });
  }

  sort(options: SortingOptions<TModel>) {
    return this.cloneAndUpdate({ sortOptions: options });
  }

  limit(by: number) {
    return this.cloneAndUpdate({ limit: by });
  }

  offset(by: number) {
    return this.cloneAndUpdate({ offset: by });
  }

  join<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    return this.cloneAndUpdate({
      joinOptions: [options] as JoinOptions<TModel, ModelSchema>[],
    });
  }

  leftJoin<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    return this.cloneAndUpdate({
      joinOptions: [
        {
          ...options,
          type: "LEFT",
        },
      ] as JoinOptions<TModel, ModelSchema>[],
    });
  }

  rightJoin<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    return this.cloneAndUpdate({
      joinOptions: [
        {
          ...options,
          type: "RIGHT",
        },
      ] as JoinOptions<TModel, ModelSchema>[],
    });
  }

  fullJoin<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    return this.cloneAndUpdate({
      joinOptions: [
        {
          ...options,
          type: "FULL",
        },
      ] as JoinOptions<TModel, ModelSchema>[],
    });
  }

  build() {
    let query: string | undefined;
    const {
      insertColumns,
      insertValues,
      whereClause,
      selectColumns,
      insertOptions,
      additionalClauses,
      deleteStatement,
      joinOptions,
      sortOptions,
      limit,
      offset,
    } = this.state || {};

    if (insertColumns && insertValues) {
      return `INSERT INTO ${this.model.name}(${insertColumns}) VALUES(${insertValues.map((_value, index) => `$${index + 1}`).join(", ")}) RETURNING ${insertOptions?.returningFields?.join(", ") ?? "*"}`;
    }
    query = `SELECT ${selectColumns ?? "*"} FROM ${this.model.name}`;

    if (deleteStatement) {
      query = `DELETE FROM ${this.model.name}`;
    }

    if (!deleteStatement && joinOptions) {
      query += joinOptions
        .map((join) => {
          const joinTableName = join.table.name;
          return ` ${join.type ?? "INNER"} JOIN ${joinTableName} ON ${this.model.name}.${join.on.field as string} = ${joinTableName}.${join.on.value as string}`;
        })
        .join("");
    }

    if (whereClause) {
      query += ` WHERE ${whereClause.field as string} ${whereClause.operator} $1`;

      if (additionalClauses) {
        query += ` ${additionalClauses.map((clause, index) => `${clause.type} ${clause.field as string} ${clause.operator} $${index + 2}`).join(" ")}`;
      }
    }

    if (deleteStatement) {
      return query;
    }

    if (sortOptions) {
      query += ` ORDER BY ${sortOptions.by.join(", ")} ${sortOptions.order ?? "ASC"}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    return query;
  }

  insert(
    columns: TModelFields,
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>>,
  ) {
    return this.cloneAndUpdate({
      insertColumns: columns.join(", "),
      insertValues: values,
      insertOptions: options,
    });
  }

  delete() {
    return this.cloneAndUpdate({
      deleteStatement: true,
    });
  }

  reset() {
    this.state = {};
    return this;
  }
}
