import React, { type HtmlHTMLAttributes } from "react";
import { Icon } from "@ds/components/ui/Icon";

import { Alert, AlertDescription, AlertTitle } from "./Alert";

export type AlertDestructiveProps = HtmlHTMLAttributes<HTMLDivElement>;

export const AlertDestructive = ({
  children,
  ...props
}: AlertDestructiveProps) => {
  return (
    <Alert {...props} variant="destructive">
      <Icon name="Alert" className="zd-size-5" />
      <AlertTitle>Greška</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
