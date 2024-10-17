import { render } from "@react-email/render";
import React from "react";

import type { InviteStudentProps } from "./types";
import InviteStudentTemplate from "./InviteStudentTemplate";

export function renderInviteStudentTemplate(props: InviteStudentProps) {
  return render(React.createElement(InviteStudentTemplate, props));
}
