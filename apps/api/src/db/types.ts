import type {
  ColumnOptionsMap,
  ModelFieldOptions,
  ModelFieldsMap,
  ModelReturnType,
} from "@zdnevnik/toolkit";

export type ModelSchema = {
  name: string;
  fields: ModelFieldsMap;
  foreignKeys?: {
    key: string;
    references: string;
    referenceKey: string;
  }[];
};

export type InsertOptions<
  TColumnOptions extends ColumnOptionsMap | undefined = ColumnOptionsMap,
> = {
  returningFields?: TColumnOptions;
};

export type SortingOptions = {
  by: ModelFieldOptions[];
  order?: "ASC" | "DESC";
};

export type ConditionalClause = {
  field: ModelFieldOptions;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: string | number;
};

export type AdditionalClause = {
  type: "AND" | "OR";
} & ConditionalClause;

export type JoinOptions = {
  type?: "INNER" | "LEFT" | "RIGHT" | "FULL";
  table: ModelReturnType;
  on: {
    field: ModelFieldOptions;
    other: ModelFieldOptions;
  };
};

export type QueryBuilderState<
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> = {
  selectColumns: TColumnOptions | undefined;
  whereClause: ConditionalClause | undefined;
  additionalClauses: AdditionalClause[] | undefined;
  insertColumns: string[] | undefined;
  insertValues: (string | number)[] | undefined;
  insertOptions: Partial<InsertOptions<TColumnOptions>> | undefined;
  sortOptions: SortingOptions | undefined;
  limit: number | undefined;
  offset: number | undefined;
  deleteStatement: boolean | undefined;
  joinOptions: JoinOptions[] | undefined;
};

export type IQueryBuilder<
  TModel extends ModelSchema,
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> = {
  where(clause: ConditionalClause): IQueryBuilder<TModel, TColumnOptions>;
  and(clause: ConditionalClause): IQueryBuilder<TModel, TColumnOptions>;
  or(clause: ConditionalClause): IQueryBuilder<TModel, TColumnOptions>;
  delete(): IQueryBuilder<TModel, TColumnOptions>;
  sort(options: SortingOptions): IQueryBuilder<TModel, TColumnOptions>;
  limit(by: number): IQueryBuilder<TModel, TColumnOptions>;
  offset(by: number): IQueryBuilder<TModel, TColumnOptions>;
  join(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  leftJoin(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  rightJoin(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  fullJoin(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  build(): string;
};
