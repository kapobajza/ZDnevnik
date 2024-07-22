import { z } from "zod";

export const paginationQueryParamSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
});

export type PaginationQueryParam = z.infer<typeof paginationQueryParamSchema>;
