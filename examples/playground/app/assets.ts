import { fileURLToPath } from "node:url";
import { createAssetServer } from "remix/assets";
import { loadConfig } from "remix/cli";

const isDevelopment = process.env.NODE_ENV === "development";
const rootDir = fileURLToPath(new URL("../", import.meta.url));
const config = await loadConfig(rootDir);
if (config.assets === undefined) {
  throw new Error("Remix asset configuration is missing");
}

export const assets = createAssetServer({
  ...config.assets,
  sourceMaps: isDevelopment ? "external" : undefined,
  minify: !isDevelopment,
  watch: false,
});

export const scriptEntry = await assets.getScriptEntry(
  "app/actions/public/entry.ts",
);
