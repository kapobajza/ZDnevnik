import React, { type HTMLAttributes } from "react";

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  return <button {...props} />;
};

export default Button;
