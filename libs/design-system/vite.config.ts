import path from "path";

import { defineConfig, type LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "default",
      },
      include: ["src/components/ui/Icon/icons/svg/*.svg"],
    }),
    dts(),
  ],
  resolve: {
    alias: {
      "@ds": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"] as LibraryFormats[],
      fileName: (format) => `index.${format}.js`,
      name: "ds",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
