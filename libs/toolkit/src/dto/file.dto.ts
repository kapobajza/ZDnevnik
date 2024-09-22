import { Readable } from "stream";

import { z } from "zod";

export const fileRequestSchema = z.object({
  filename: z.string(),
  file: z.instanceof(Readable),
  mimetype: z.union([z.literal("image/jpeg"), z.literal("image/png")]),
});
