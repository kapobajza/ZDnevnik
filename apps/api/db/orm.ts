import {
  types as PgTypes,
  type FieldDef,
  type Pool as PgPool,
  type QueryArrayResult,
  type QueryResultRow,
} from "pg";
import {
  modelFieldOptionsSchema,
  type InferColumnOptionsResult,
  type PascalToSnakeCaseRecord,
  type SnakeToPascalCase,
  type ColumnOptionsMap,
} from "@zdnevnik/toolkit";

import {
  type ConditionalClause,
  type IQueryBuilder,
  type InsertOptions,
  type JoinOptions,
  type ModelSchema,
  type QueryBuilderState,
  type SortingOptions,
} from "./types";
import { QueryBuilder } from "./queryBuilder";

import type { MappedTable } from "~/api/types";

export class ModelORM<
  TModel extends ModelSchema,
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> implements IQueryBuilder<TModel, TColumnOptions>
{
  private queryBuilder: QueryBuilder<TModel>;

  constructor(
    private model: TModel,
    private pool: PgPool,
    private mappedTable: MappedTable,
  ) {
    this.queryBuilder = new QueryBuilder(this.model);
  }

  cloneAndUpdate(update: Partial<QueryBuilderState<TColumnOptions>>) {
    this.queryBuilder = this.queryBuilder.cloneAndUpdate(update);
    return this;
  }

  select<TColumnOptions extends ColumnOptionsMap | undefined = undefined>(
    columns?: TColumnOptions,
  ) {
    this.queryBuilder = this.queryBuilder.select(columns);
    return this as unknown as ModelORM<
      TModel,
      TColumnOptions extends undefined
        ? {
            [Key in keyof PascalToSnakeCaseRecord<
              TModel["fields"]
            >]: TModel["fields"][SnakeToPascalCase<Key>];
          }
        : TColumnOptions
    >;
  }

  where(clause: ConditionalClause) {
    this.queryBuilder = this.queryBuilder.where(clause);
    return this;
  }

  and(clause: ConditionalClause) {
    this.queryBuilder = this.queryBuilder.and(clause);
    return this;
  }

  or(clause: ConditionalClause) {
    this.queryBuilder = this.queryBuilder.or(clause);
    return this;
  }

  sort(options: SortingOptions) {
    this.queryBuilder = this.queryBuilder.sort(options);
    return this;
  }

  limit(by: number) {
    this.queryBuilder = this.queryBuilder.limit(by);
    return this;
  }

  offset(by: number) {
    this.queryBuilder = this.queryBuilder.offset(by);
    return this;
  }

  build(): string {
    return this.queryBuilder.build();
  }

  insert<TColumnOptions extends ColumnOptionsMap | undefined = undefined>(
    def: [keyof TModel["fields"], string | number | boolean][],
    options?: Partial<InsertOptions<TColumnOptions>> | undefined,
  ) {
    this.queryBuilder = this.queryBuilder.insert(def as never, options);
    return this as unknown as ModelORM<
      TModel,
      TColumnOptions extends undefined
        ? {
            [Key in keyof PascalToSnakeCaseRecord<
              TModel["fields"]
            >]: TModel["fields"][SnakeToPascalCase<Key>];
          }
        : TColumnOptions
    >;
  }

  delete() {
    this.queryBuilder = this.queryBuilder.delete();
    return this;
  }

  join(options: JoinOptions) {
    this.queryBuilder = this.queryBuilder.join(options);
    return this;
  }

  leftJoin(options: JoinOptions) {
    this.queryBuilder = this.queryBuilder.leftJoin(options);
    return this;
  }

  rightJoin(options: JoinOptions) {
    this.queryBuilder = this.queryBuilder.rightJoin(options);
    return this;
  }

  fullJoin(options: JoinOptions) {
    this.queryBuilder = this.queryBuilder.fullJoin(options);
    return this;
  }

  getQueryValues = () => {
    const state = this.queryBuilder.state;

    if (state.insertValues) {
      return state.insertValues;
    }

    if (state.whereClause?.value) {
      const values = [state.whereClause.value];

      if (state.additionalClauses) {
        values.push(...state.additionalClauses.map((c) => c.value));
      }

      return values;
    }

    return undefined;
  };

  private getConvertedValue<TResult>(
    value: TResult | undefined,
    field: FieldDef,
  ) {
    let finalValue: number | boolean | string | null = null;

    if (value) {
      const strValue = value as unknown as string;
      type Builtins =
        | typeof PgTypes.builtins.INT2
        | typeof PgTypes.builtins.INT4
        | typeof PgTypes.builtins.INT8
        | typeof PgTypes.builtins.NUMERIC
        | typeof PgTypes.builtins.BOOL
        | typeof PgTypes.builtins.TIMESTAMP;
      const dataType = field.dataTypeID as unknown as Builtins;

      switch (dataType) {
        case PgTypes.builtins.INT2:
        case PgTypes.builtins.INT4:
        case PgTypes.builtins.INT8:
          finalValue = parseInt(strValue, 10);
          break;

        case PgTypes.builtins.NUMERIC:
          finalValue = parseFloat(strValue);
          break;

        case PgTypes.builtins.TIMESTAMP:
          finalValue = new Date(strValue).getTime();
          break;

        case PgTypes.builtins.BOOL:
          finalValue = strValue === "true";
          break;

        default:
          finalValue = strValue;
          break;
      }
    }

    return finalValue;
  }

  private buildSingleSelectColumn<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >(
    selectColumns: ColumnOptionsMap,
    fields: FieldDef[],
    values: TResult[],
  ): TResult {
    const obj: Record<string, unknown> = {};

    for (const columnKey in selectColumns) {
      const column = selectColumns[columnKey];
      const columnParseRes = modelFieldOptionsSchema.safeParse(column);

      if (!columnParseRes.success && typeof column === "object") {
        obj[columnKey] = this.buildSingleSelectColumn(
          column as ColumnOptionsMap,
          fields,
          values,
        );
        continue;
      }

      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const value = values[i];
        const tableId = this.mappedTable[column?.modelName as string];

        if (field?.name === column?.name && tableId === field?.tableID) {
          obj[columnKey] = this.getConvertedValue(value, field as FieldDef);
        }
      }
    }

    return obj as unknown as TResult;
  }

  private buildTableFromFields<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >(
    fields: FieldDef[],
    values: TResult[],
    tableId: number | undefined,
  ): TResult {
    return fields.reduce((obj, field, index) => {
      const value = values[index];

      if (!field?.name || tableId !== field?.tableID) {
        return obj;
      }

      return {
        ...obj,
        [field.name]: this.getConvertedValue(value, field),
      };
    }, {} as TResult);
  }

  private buildSelectColumns<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >(queryResult: QueryArrayResult<TResult[]>): TResult[] {
    const { selectColumns } = this.queryBuilder.state || {};

    if (!selectColumns) {
      return queryResult.rows.map((row) => {
        return this.buildTableFromFields(
          queryResult.fields,
          row,
          this.mappedTable[this.model.name],
        );
      });
    }

    return queryResult.rows.map((row) => {
      return this.buildSingleSelectColumn(
        selectColumns,
        queryResult.fields,
        row,
      );
    });
  }

  private buildJoinSelectColumns<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >(queryResult: QueryArrayResult<TResult[]>): TResult[] {
    const { selectColumns, joinOptions = [] } = this.queryBuilder.state;

    if (!selectColumns) {
      const tables = [
        this.model.name,
        ...joinOptions.map((join) => join.table.name),
      ];

      return queryResult.rows.map((row) => {
        return tables.reduce((obj, table) => {
          const customTable = this.buildTableFromFields(
            queryResult.fields,
            row,
            this.mappedTable[table],
          );

          return {
            ...obj,
            [table]: customTable,
          };
        }, {} as TResult);
      });
    }

    return this.buildSelectColumns(queryResult);
  }

  private reset() {
    this.queryBuilder = this.queryBuilder.reset();
  }

  async execute<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >(): Promise<TResult[]> {
    const client = await this.pool.connect();
    const { joinOptions } = this.queryBuilder.state;

    try {
      const query = this.build();
      const queryValues = this.getQueryValues();

      const res = (await this.pool.query<TResult>(
        {
          text: query,
          // @ts-expect-error - Incorrect types provided by pg
          rowMode: "array",
        },
        queryValues,
      )) as unknown as QueryArrayResult<TResult[]>;

      if (joinOptions) {
        return this.buildJoinSelectColumns(res);
      }

      return this.buildSelectColumns(res);
    } finally {
      this.reset();
      client?.release();
    }
  }

  async executeOne<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >(): Promise<TResult | undefined> {
    this.queryBuilder = this.queryBuilder.limit(1);
    const results = await this.execute<TResult>();
    return results?.[0];
  }

  async transaction(callback: (cb: this) => Promise<void>) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      await callback(this);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
      this.reset();
    }
  }
}
