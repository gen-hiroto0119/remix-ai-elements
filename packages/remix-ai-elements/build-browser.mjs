import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = fileURLToPath(new URL(".", import.meta.url));
const result = await build({
  absWorkingDir: root,
  entryPoints: ["src/ai-sdk.ts"],
  outfile: "dist/ai-sdk.browser.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2024",
  sourcemap: true,
  metafile: true,
  legalComments: "linked",
  banner: {
    js: "/*! Browser AI SDK binding. Third-party licenses: ai-sdk.browser.NOTICES.txt */",
  },
});

const output = result.metafile.outputs["dist/ai-sdk.browser.js"];
assert.ok(output);
assert.equal(
  output.imports.length,
  0,
  "Browser binding must be self-contained ESM",
);
const apacheLicense = readFileSync(
  join(root, "LICENSES/Apache-2.0.txt"),
  "utf8",
).trim();
const fullLicenseTexts = new Map([["Apache-2.0", apacheLicense]]);
const notices = new Map();
for (const [input, { bytesInOutput }] of Object.entries(output.inputs)) {
  if (!bytesInOutput || !input.includes("node_modules/")) continue;
  let directory = dirname(resolve(root, input));
  while (dirname(directory) !== directory) {
    const manifest = join(directory, "package.json");
    if (existsSync(manifest)) {
      const pkg = JSON.parse(readFileSync(manifest, "utf8"));
      if (pkg.name) {
        const key = `${pkg.name}@${pkg.version}`;
        if (!notices.has(key)) {
          const files = readdirSync(directory).filter((name) =>
            /^(license|notice)(\.|$)/i.test(name),
          );
          assert.ok(
            files.length > 0 || fullLicenseTexts.has(pkg.license),
            `Missing license for bundled package ${key}`,
          );
          const packageNotices = files
            .map((name) => readFileSync(join(directory, name), "utf8"))
            .join("\n");
          notices.set(
            key,
            [`${key} (${pkg.license})`, packageNotices]
              .filter(Boolean)
              .join("\n\n"),
          );
        }
        break;
      }
    }
    directory = dirname(directory);
  }
}
const noticeSections = [
  ...[...notices.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, notice]) => notice),
  `Apache License 2.0 (full text)\n\n${apacheLicense}`,
];
writeFileSync(
  join(root, "dist/ai-sdk.browser.NOTICES.txt"),
  noticeSections.join("\n\n---\n\n"),
);
console.log(
  `Browser binding: ${output.bytes} bytes; ${notices.size} third-party notices.`,
);
