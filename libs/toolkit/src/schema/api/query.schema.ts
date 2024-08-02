import { z } from "zod";

import { type HelperType } from "~/toolkit/types/common";

export const paginationQueryParamSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
});

export type PaginationQueryParam = z.infer<typeof paginationQueryParamSchema>;

export const helper = (str: HelperType) => {
  console.log(str);
};
