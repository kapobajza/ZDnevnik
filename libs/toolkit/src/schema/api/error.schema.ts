import { z } from "zod";

export const errorResponseLiteralSchema = z.union([
  z.literal("invalid_credentials"),
  z.literal("unknown"),
]);

export type ErrorResponseLiteral = z.infer<typeof errorResponseLiteralSchema>;

export const errorResponseSchema = z.object({
  code: errorResponseLiteralSchema,
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type ZErrorResponse = z.infer<typeof errorResponseSchema>;

export const ErrorResponseCode = {
  INVALID_CREDENTIALS: "invalid_credentials",
  UNKNOWN: "unknown",
} as const satisfies {
  [key in Uppercase<ErrorResponseLiteral>]: ErrorResponseLiteral;
};
