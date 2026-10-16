import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const librarySource = fileURLToPath(
  new URL("../../packages/remix-ai-elements/src/", import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: [
      { find: /^remix-ai-elements\//, replacement: librarySource },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
