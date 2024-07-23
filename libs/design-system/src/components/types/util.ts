type ExtendedRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], null>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequiredVariantProps<Component extends (...args: any) => any> =
  ExtendedRequired<Parameters<Component>[0]>;
