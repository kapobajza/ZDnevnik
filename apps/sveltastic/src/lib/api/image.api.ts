import type { ImageUploadResponseDTO } from "@zdnevnik/toolkit";

import type { CreateInstanceOptions } from "./api";
import { createApi } from "./api";

export const createImageApi = (options: CreateInstanceOptions) => {
  const imageApi = createApi({
    ...options,
    routePrefix: "images",
  });

  return {
    async upload(file: File) {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await imageApi.post<ImageUploadResponseDTO>(
        "upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },
  };
};

export type ImageApi = ReturnType<typeof createImageApi>;
