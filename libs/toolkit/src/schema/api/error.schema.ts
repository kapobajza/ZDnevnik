import { z } from "zod";

export const errorResponseLiteralSchema = z.literal("invalid_credentials");

export type ErrorResponseLiteral = z.infer<typeof errorResponseLiteralSchema>;

export const createErrorResponseSchema = (error: ErrorResponseLiteral) => {
  return z.object({
    error: z.literal(error),
  });
};

const invalidCredentialsSchema = createErrorResponseSchema(
  "invalid_credentials",
);

export type InvalidCredentialsSchema = z.infer<typeof invalidCredentialsSchema>;

export const ErrorResponseCode = {
  INVALID_CREDENTIALS: "invalid_credentials",
} as const satisfies {
  [key in Uppercase<ErrorResponseLiteral>]: ErrorResponseLiteral;
};
