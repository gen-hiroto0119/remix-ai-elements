import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const consumer = mkdtempSync(join(tmpdir(), "remix-elements-consumer-"));
const pack = JSON.parse(
  execFileSync("npm", ["pack", "--json", "--pack-destination", consumer], {
    cwd: resolve(root, "packages/remix-ai-elements"),
    encoding: "utf8",
  }),
)[0];
assert.ok(pack.files.every((file) => !file.path.startsWith("examples/")));
writeFileSync(
  join(consumer, "package.json"),
  JSON.stringify({ name: "isolated-consumer", private: true, type: "module" }),
);
execFileSync(
  "npm",
  [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    join(consumer, pack.filename),
    "remix@3.0.0",
  ],
  { cwd: consumer, stdio: "inherit" },
);
writeFileSync(
  join(consumer, "consumer.mjs"),
  `
import assert from 'node:assert/strict';
import { createElement } from 'remix/component';
import { renderToString } from 'remix/component/server';
import { Message, MessageContent } from 'remix-ai-elements/message';
import { Markdown } from 'remix-ai-elements/markdown';
const html = await renderToString(createElement(Message, {}, createElement(MessageContent, {}, createElement(Markdown, { content: '**Packed consumer**' }))));
assert.ok(html.includes('<strong>Packed consumer</strong>'));
for (const name of ['message-scroller', 'prompt-input', 'trace', 'reasoning', 'tool', 'code-block', 'theme']) await import('remix-ai-elements/' + name);
for (const name of ['react', 'react-dom', 'tailwindcss', 'ai', '@ai-sdk/react']) {
  assert.throws(() => import.meta.resolve(name), { code: 'ERR_MODULE_NOT_FOUND' });
}
console.log('Packed exports, SSR and dependency isolation passed.');
`,
);
execFileSync(process.execPath, ["consumer.mjs"], {
  cwd: consumer,
  stdio: "inherit",
});
writeFileSync(
  join(consumer, "consumer.mts"),
  `import { Message, type MessageProps } from 'remix-ai-elements/message';\nimport { CodeBlock, type CodeBlockProps } from 'remix-ai-elements/code-block';\nconst message: MessageProps = { from: 'user', children: 'Hello' };\nconst code: CodeBlockProps = { code: 'const a = 1;', lineNumbers: true };\nexport { Message, CodeBlock, message, code };\n`,
);
execFileSync(
  process.execPath,
  [
    resolve(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--target",
    "es2024",
    "--module",
    "nodenext",
    "--moduleResolution",
    "nodenext",
    "consumer.mts",
  ],
  { cwd: consumer, stdio: "inherit" },
);
console.log("Packed declarations passed in an isolated consumer.");
