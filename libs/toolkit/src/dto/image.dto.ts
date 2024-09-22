import { Readable } from "stream";

import { z } from "zod";

export const imageUploadResponseSchema = z.object({
  url: z.string(),
});

export type ImageUploadResponseDTO = z.infer<typeof imageUploadResponseSchema>;

export const imageGetParamsSchema = z.object({
  key: z.string(),
});

export const imageGetResponseSchema = z.instanceof(Readable);