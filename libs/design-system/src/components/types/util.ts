import type { OmitUndefined } from "class-variance-authority/types";

type ExtendedRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], null>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequiredVariantProps<Component extends (...args: any) => any> =
  ExtendedRequired<
    Omit<OmitUndefined<Parameters<Component>[0]>, "class" | "className">
  >;
