import path from "path";

import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig(() => {
  return {
    plugins: [enhancedImages(), sveltekit(), svelteTesting()],
    test: {
      include: ["src/**/*.{test,spec}.{js,ts}"],
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
    resolve: {
      alias: {
        $src: path.resolve("./src"),
        "@zdnevnik/toolkit": path.resolve("../../libs/toolkit/src"),
        "~/toolkit": path.resolve("../../libs/toolkit/src"),
      },
    },
    server: {
      port: parseInt(process.env.PORT ?? "3000", 10),
      strictPort: true,
      host: process.env.HOST ?? "zdnevnik.local",
      open: false,
    },
  };
});
