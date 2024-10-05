import type { ImageUploadResponseDTO } from "@zdnevnik/toolkit";

import type { ApiMethodOptions, CreateInstanceOptions } from "./api";
import { createApi } from "./api";

export const createImageApi = (options: CreateInstanceOptions) => {
  const imageApi = createApi({
    ...options,
    routePrefix: "images",
  });

  return {
    async upload(body: unknown, options?: ApiMethodOptions) {
      const { data } = await imageApi.post<ImageUploadResponseDTO>(
        "upload",
        body,
        options,
      );

      return data;
    },
  };
};

export type ImageApi = ReturnType<typeof createImageApi>;
