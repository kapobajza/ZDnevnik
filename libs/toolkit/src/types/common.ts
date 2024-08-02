export type ObjectValues<T> = T[keyof T];

export type PascalToSnakeCase<
  T extends string,
  TInit = true,
> = T extends `${infer Head}${infer Rest}`
  ? `${TInit extends true
      ? Lowercase<Head>
      : Head extends Uppercase<Head>
        ? Rest extends `${infer Next}${string}`
          ? Next extends Uppercase<Next>
            ? Head
            : `_${Lowercase<Head>}`
          : ""
        : Lowercase<Head>}${PascalToSnakeCase<Rest, false>}`
  : "";

export type PascalToSnakeCaseRecord<InputType> =
  InputType extends Array<unknown>
    ? PascalToSnakeCaseRecord<InputType[number]>[]
    : InputType extends object
      ? {
          [K in keyof InputType as PascalToSnakeCase<
            K & string
          >]: PascalToSnakeCaseRecord<InputType[K]>;
        }
      : InputType;

export type SnakeToPascalCase<Key extends string | number | symbol> =
  Key extends `${infer First}_${infer Rest}`
    ? `${Capitalize<Lowercase<First>>}${SnakeToPascalCase<Rest>}`
    : // @ts-expect-error - Key should never be a number or a symbol
      Capitalize<Lowercase<Key>>;

export type HelperType = "helper" | "type";
