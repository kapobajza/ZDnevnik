import { z } from "zod";

export const imageUploadResponseSchema = z.object({
  url: z.string(),
});

export type ImageUploadResponseDTO = z.infer<typeof imageUploadResponseSchema>;

export const imageGetParamsSchema = z.object({
  key: z.string(),
});

export const AcceptableImageType = {
  Jpeg: "image/jpeg",
  Png: "image/png",
} as const;

export const MAX_IMAGE_SIZE = 1024 * 1024 * 10;
