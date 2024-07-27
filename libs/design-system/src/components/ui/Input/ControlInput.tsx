import React, { forwardRef } from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

import { Input, type InputProps } from "./Input";

export type ControlInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<InputProps, "onChange" | "onBlur" | "value" | "error"> &
  Omit<UseControllerProps<TFieldValues, TName>, "control" | "rules"> & {
    control: Control<TFieldValues>;
  };

export const ControlInput = forwardRef(
  ({ control, name, defaultValue, disabled, ...otherProps }, ref) => {
    const { field, fieldState } = useController({
      name,
      control,
      defaultValue,
      disabled,
    });

    return (
      <Input
        {...field}
        {...otherProps}
        error={fieldState.error?.message}
        ref={ref}
      />
    );
  },
) as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  p: ControlInputProps<TFieldValues, TName> & {
    ref?: React.Ref<HTMLInputElement>;
  },
) => React.ReactElement<ControlInputProps<TFieldValues, TName>>;
