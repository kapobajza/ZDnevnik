import type {
  UseFormProps as UseRHFormProps,
  UseFormReturn,
} from "react-hook-form";
import { type FieldValues, useForm as useRHForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

export type UseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
> = Partial<UseRHFormProps<TFieldValues, TContext>> & {
  schema: ZodType;
};

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  schema,
  ...props
}: UseFormProps<TFieldValues, TContext>): UseFormReturn<
  TFieldValues,
  TContext,
  TTransformedValues
> {
  return useRHForm({
    ...props,
    resolver: zodResolver(schema),
  });
}
