import {
  fromPascalToSnakeCase,
  modelFieldOptionsSchema,
  type ColumnOptionsMap,
} from "@zdnevnik/toolkit";

import {
  type ConditionalClause,
  type IQueryBuilder,
  type MutationOptions,
  type QueryBuilderState,
  type SortingOptions,
  type ModelSchema,
  type JoinOptions,
} from "./types";
import { CommonModelField } from "./util";

import { timestampGeneralFormat } from "~/api/util/date_time";

export class QueryBuilder<
  TModel extends ModelSchema,
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> implements IQueryBuilder<TModel, TColumnOptions>
{
  state: Partial<QueryBuilderState<TColumnOptions>> = {};

  constructor(private model: TModel) {}

  cloneAndUpdate = (update: Partial<QueryBuilderState>) => {
    const newState = {
      ...this.state,
      ...update,
    };

    for (const [key, value] of Object.entries(update)) {
      const updateKey = key as keyof QueryBuilderState;
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

  private setState(newState: Partial<QueryBuilderState<TColumnOptions>>) {
    this.state = newState;
    return this;
  }

  select(columns?: TColumnOptions) {
    return this.cloneAndUpdate({
      selectColumns: columns,
    });
  }

  where(clause: ConditionalClause) {
    return this.cloneAndUpdate({ whereClause: clause });
  }

  and(clause: ConditionalClause) {
    return this.cloneAndUpdate({
      additionalClauses: [
        {
          ...clause,
          type: "AND",
        },
      ],
    });
  }

  or(clause: ConditionalClause) {
    return this.cloneAndUpdate({
      additionalClauses: [
        {
          ...clause,
          type: "OR",
        },
      ],
    });
  }

  sort(options: SortingOptions) {
    return this.cloneAndUpdate({ sortOptions: options });
  }

  limit(by: number) {
    return this.cloneAndUpdate({ limit: by });
  }

  offset(by: number) {
    return this.cloneAndUpdate({ offset: by });
  }

  join(options: JoinOptions) {
    return this.cloneAndUpdate({
      joinOptions: [options],
    });
  }

  leftJoin(options: JoinOptions) {
    return this.cloneAndUpdate({
      joinOptions: [
        {
          ...options,
          type: "LEFT",
        },
      ],
    });
  }

  rightJoin(options: JoinOptions) {
    return this.cloneAndUpdate({
      joinOptions: [
        {
          ...options,
          type: "RIGHT",
        },
      ],
    });
  }

  fullJoin(options: JoinOptions) {
    return this.cloneAndUpdate({
      joinOptions: [
        {
          ...options,
          type: "FULL",
        },
      ],
    });
  }

  private buildTableColumnsRaw(
    columns: TColumnOptions,
    includeModelName = false,
  ) {
    const result: string[] = [];

    for (const column of Object.values(columns)) {
      const columnParseRes = modelFieldOptionsSchema.safeParse(column);

      if (columnParseRes.success) {
        result.push(
          `${includeModelName ? columnParseRes.data.modelName + "." : ""}${columnParseRes.data.name}`,
        );
        continue;
      }

      result.push(
        this.buildTableColumnsRaw(column as TColumnOptions, includeModelName),
      );
    }

    return result.join(", ");
  }

  private buildTableColumns(
    columns: TColumnOptions | undefined,
    includeModelName = false,
  ) {
    if (!columns) {
      return "*";
    }

    return this.buildTableColumnsRaw(columns, includeModelName);
  }

  private buildReturningStatement(
    fields: MutationOptions<TColumnOptions>["returningFields"],
  ) {
    if (!fields) {
      return "";
    }

    if (typeof fields === "string") {
      return ` RETURNING ${fields}`;
    }

    return ` RETURNING ${this.buildTableColumns(fields)}`;
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
      updateColumns,
      updateValues,
      updateOptions,
    } = this.state || {};

    if (insertColumns && insertValues) {
      if (
        !insertColumns.includes(CommonModelField.CreatedAt.name) &&
        !insertColumns.includes(CommonModelField.UpdatedAt.name)
      ) {
        insertColumns.push(
          CommonModelField.CreatedAt.name,
          CommonModelField.UpdatedAt.name,
        );
        const createdUpdatedDate = timestampGeneralFormat(new Date());
        insertValues.push(createdUpdatedDate, createdUpdatedDate);
      }

      return `INSERT INTO ${this.model.name}(${insertColumns.join(", ")}) VALUES(${insertValues.map((_value, index) => `$${index + 1}`).join(", ")})${this.buildReturningStatement(insertOptions?.returningFields)}`;
    }

    query = `SELECT ${this.buildTableColumns(selectColumns as TColumnOptions, true)} FROM ${this.model.name}`;

    if (updateColumns && updateValues) {
      if (!updateColumns.includes(CommonModelField.UpdatedAt.name)) {
        updateColumns.push(CommonModelField.UpdatedAt.name);
        updateValues.push(timestampGeneralFormat(new Date()));
      }

      query = `UPDATE ${this.model.name} SET ${updateColumns.map((column, index) => `${column} = $${index + 1}`).join(", ")}`;
    }

    if (deleteStatement) {
      query = `DELETE FROM ${this.model.name}`;
    }

    if (!deleteStatement && !updateColumns && joinOptions) {
      query += joinOptions
        .map((join) => {
          return ` ${join.type ?? "INNER"} JOIN ${join.table.name} ON ${join.on.field.modelName}.${join.on.field.name} = ${join.on.other.modelName}.${join.on.other.name}`;
        })
        .join("");
    }

    if (whereClause) {
      query += ` WHERE ${whereClause.field.modelName}.${whereClause.field.name} ${whereClause.operator} $1`;

      if (additionalClauses) {
        query += ` ${additionalClauses.map((clause, index) => `${clause.type} ${clause.field.modelName}.${clause.field.name} ${clause.operator} $${index + 2}`).join(" ")}`;
      }
    }

    if (deleteStatement ?? updateColumns) {
      if (updateColumns) {
        query += `${this.buildReturningStatement(updateOptions?.returningFields)}`;
      }

      return query;
    }

    if (sortOptions) {
      query += ` ORDER BY ${sortOptions.by.map((field) => `${field.modelName}.${field.name}`).join(", ")} ${sortOptions.order ?? "ASC"}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    return query;
  }

  private generateMutationFieldsAndValues(
    def: [keyof TModel["fields"], string | number][],
  ) {
    return def.reduce(
      (obj, [field, value]) => {
        return {
          fields: [...obj.fields, fromPascalToSnakeCase(field as string)],
          values: [...obj.values, value],
        };
      },
      {
        fields: [],
        values: [],
      } as {
        fields: string[];
        values: (string | number)[];
      },
    );
  }

  insert(
    def: [keyof TModel["fields"], string | number][],
    options?: Partial<MutationOptions<TColumnOptions>> | undefined,
  ) {
    const { values, fields } = this.generateMutationFieldsAndValues(def);

    return this.cloneAndUpdate({
      insertColumns: fields,
      insertValues: values,
      insertOptions: options,
    });
  }

  update(
    def: [keyof TModel["fields"], string | number][],
    options?: Partial<MutationOptions<TColumnOptions>> | undefined,
  ) {
    const { values, fields } = this.generateMutationFieldsAndValues(def);

    return this.cloneAndUpdate({
      updateColumns: fields,
      updateValues: values,
      updateOptions: options,
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
