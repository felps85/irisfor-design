import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: currentDir,
  base: "./",
  publicDir: resolve(currentDir, "public"),
  server: {
    host: "0.0.0.0",
    port: 5173
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  build: {
    outDir: resolve(currentDir, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(currentDir, "index.html"),
        install: resolve(currentDir, "install/index.html"),
        privacy: resolve(currentDir, "privacy/index.html"),
        support: resolve(currentDir, "support/index.html")
      }
    }
  }
});
