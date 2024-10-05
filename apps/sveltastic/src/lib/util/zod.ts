import type { ZodCustomIssue } from "@zdnevnik/toolkit";
import {
  errorResponseSchema,
  type ErrorResponseLiteral,
  type LoginBody,
  type AddStudentWithFileBody,
  MAX_IMAGE_SIZE,
} from "@zdnevnik/toolkit";
import type { ZodTooBigIssue } from "zod";
import type { ZodIssueCode } from "zod";
import { z } from "zod";
import { get } from "svelte/store";

import LL from "$src/i18n/i18n-svelte";

type RequiredValidationField =
  | keyof Pick<LoginBody, "username" | "password">
  | keyof Omit<AddStudentWithFileBody, "avatar" | "ordinalNumber">;

type IssueMap = Record<
  `${typeof ZodIssueCode.too_small}_string`,
  Record<RequiredValidationField, string>
> &
  Record<
    typeof ZodCustomIssue.FileTooBig,
    Record<keyof Pick<AddStudentWithFileBody, "avatar">, string>
  >;

export const generateZodErrorMap: z.ZodErrorMap = (issue) => {
  const message = issue.message ?? "";
  const t = get(LL);

  const issueMap = {
    too_small_string: {
      username: t.validation_field_required({
        field: t.login.username_placeholder(),
      }),
      firstName: t.validation_field_required({
        field: t.home.add_student_first_name_placeholder(),
      }),
      lastName: t.validation_field_required({
        field: t.home.add_student_last_name_placeholder(),
      }),
      password: t.validation_field_required({
        field: t.login.password_placeholder(),
        gender: "f",
      }),
      classroomId: t.validation_field_required({
        field: t.home.add_student_classroom_placeholder(),
        gender: "m",
      }),
    },
    file_too_big: {
      avatar: t.validation_file_too_big({
        max: MAX_IMAGE_SIZE / 1024 / 1024,
      }),
    },
  } as const satisfies IssueMap;

  const issueWithType = issue as ZodTooBigIssue;

  const path = (issue.path?.[0] ?? "") as RequiredValidationField;
  const issueCode = (
    issue.code === "custom" ? issue.params?.code : issue.code
  ) as string;
  const localizedIssue =
    issueMap[
      `${issueCode}${issueWithType.type ? `_${issueWithType.type}` : ""}` as keyof typeof issueMap
    ];
  const localizedMessage =
    localizedIssue?.[path as keyof typeof localizedIssue] ?? message;

  return { message: localizedMessage };
};

export const initZodErrorMap = () => {
  z.setErrorMap(generateZodErrorMap);
};

export const isResponseCode = (error: unknown, code: ErrorResponseLiteral) => {
  const errRes = errorResponseSchema.safeParse(error);
  return errRes.success && errRes.data.code === code;
};
