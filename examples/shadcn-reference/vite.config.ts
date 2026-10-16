import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const referenceSource = fileURLToPath(new URL("./src/", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: [{ find: /^@\//, replacement: referenceSource }],
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
  },
});
