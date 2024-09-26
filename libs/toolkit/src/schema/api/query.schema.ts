import { z } from "zod";

export const paginationQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((page) => {
      const parsedPage = parseInt(page ?? "1", 10);

      if (isNaN(parsedPage)) {
        return 1;
      }

      return parsedPage;
    }),
  limit: z
    .string()
    .optional()
    .transform((limit) => {
      const parsedLimit = parseInt(limit ?? "10", 10);

      if (isNaN(parsedLimit)) {
        return 10;
      }

      return Math.min(parsedLimit, 100);
    }),
});

export type PaginationQueryParam = z.infer<typeof paginationQueryParamSchema>;
