import React, { type SVGProps } from "react";

import { iconsMap } from "./icons";

export type IconName = keyof typeof iconsMap;

export type IconProps = {
  name: IconName;
} & SVGProps<SVGSVGElement>;

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = iconsMap[name];

  return <IconComponent {...props} />;
};
