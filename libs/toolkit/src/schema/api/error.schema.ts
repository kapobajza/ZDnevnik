import { z } from "zod";

export const errorResponseLiteralSchema = z.literal("invalid_credentials");

export type ErrorResponseLiteral = z.infer<typeof errorResponseLiteralSchema>;

export const createErrorResponseSchema = (error: ErrorResponseLiteral) => {
  return z.object({
    error: z.literal(error),
  });
};
