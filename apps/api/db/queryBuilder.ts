import type { ModelSchema } from "./models";
import type {
  ConditionalClause,
  IQueryBuilder,
  InferModelField,
  InsertOptions,
  QueryBuilderState,
  SortingOptions,
} from "./types";

export class QueryBuilder<TModel extends ModelSchema>
  implements IQueryBuilder<TModel>
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

  select(...columns: (keyof InferModelField<TModel["fields"]>)[]) {
    return this.cloneAndUpdate({ selectColumns: columns.join(", ") });
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
    } = this.state || {};

    if (insertColumns && insertValues) {
      return `INSERT INTO ${this.model.name}(${insertColumns}) VALUES(${insertValues.map((_value, index) => `$${index + 1}`).join(", ")}) RETURNING ${insertOptions?.returningFields?.join(", ") ?? "*"}`;
    }
    query = `SELECT ${selectColumns ?? "*"} FROM ${this.model.name}`;

    if (deleteStatement) {
      query = `DELETE FROM ${this.model.name}`;
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

    if (this.state.sortOptions) {
      query += ` ORDER BY ${this.state.sortOptions.by.join(", ")} ${this.state.sortOptions.order ?? "ASC"}`;
    }

    if (this.state.limit) {
      query += ` LIMIT ${this.state.limit}`;
    }

    if (this.state.offset) {
      query += ` OFFSET ${this.state.offset}`;
    }

    return query;
  }

  insert(
    columns: (keyof InferModelField<TModel["fields"]>)[],
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
