import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const consumerParent = resolve(process.env.CONSUMER_OUTPUT_DIR || tmpdir());
mkdirSync(consumerParent, { recursive: true });
const consumer = mkdtempSync(join(consumerParent, "remix-elements-consumer-"));
const playground = join(consumer, "examples", "playground");
const shared = join(consumer, "examples", "shared");
const packageArgument = process.argv[2];
const rootPackage = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf8"),
);
const nodeTypesVersion = rootPackage.devDependencies?.["@types/node"];
assert.ok(nodeTypesVersion, "Expected @types/node in root devDependencies");
const playgroundPackage = JSON.parse(
  readFileSync(resolve(root, "examples/playground/package.json"), "utf8"),
);
const aiVersion = playgroundPackage.dependencies.ai;
assert.equal(
  aiVersion,
  rootPackage.devDependencies?.ai,
  "Expected the workspace and root AI SDK versions to match",
);

mkdirSync(playground, { recursive: true });
mkdirSync(shared, { recursive: true });
const packageArchive = await preparePackageArchive(packageArgument);
const packageSpec = `file:${packageArchive}`;

writeFileSync(
  join(consumer, "package.json"),
  JSON.stringify(
    {
      name: "isolated-consumer",
      private: true,
      type: "module",
      dependencies: {
        remix: playgroundPackage.dependencies.remix,
        "remix-ai-elements": packageSpec,
      },
      devDependencies: {
        "@types/node": nodeTypesVersion,
      },
    },
    null,
    2,
  ),
);
const consumerTsconfig = JSON.parse(
  readFileSync(resolve(root, "tsconfig.json"), "utf8"),
);
consumerTsconfig.compilerOptions.paths = {};
writeFileSync(
  join(consumer, "tsconfig.json"),
  `${JSON.stringify(consumerTsconfig, null, 2)}\n`,
);

execFileSync(
  "npm",
  ["install", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: consumer, stdio: "inherit" },
);
assert.equal(existsSync(join(consumer, "packages")), false);
const installedPackage = realpathSync(
  join(consumer, "node_modules", "remix-ai-elements"),
);
assert.equal(
  installedPackage.startsWith(resolve(root, "packages", "remix-ai-elements")),
  false,
);
for (const path of [
  "dist/primitives.js",
  "dist/primitives.d.ts",
  "dist/ai-sdk.js",
  "dist/ai-sdk.d.ts",
  "dist/ai-sdk.browser.js",
  "dist/ai-sdk.browser.NOTICES.txt",
  "LICENSES/Apache-2.0.txt",
  "dist/internal/icon.js",
  "dist/internal/parts.js",
]) {
  assert.ok(
    existsSync(join(installedPackage, path)),
    `Tarball omitted ${path}`,
  );
}
const apacheLicense = readFileSync(
  join(installedPackage, "LICENSES/Apache-2.0.txt"),
  "utf8",
).trim();
const browserNotices = readFileSync(
  join(installedPackage, "dist/ai-sdk.browser.NOTICES.txt"),
  "utf8",
);
assert.ok(browserNotices.includes(apacheLicense));
assert.match(browserNotices, /ai@7\.0\.142/);
assert.match(
  browserNotices,
  /@ai-sdk\/provider-utils@5\.0\.61 \(Apache-2\.0\)/,
);
for (const path of ["src", "tests", "examples"]) {
  assert.equal(
    existsSync(join(installedPackage, path)),
    false,
    `Tarball unexpectedly contains ${path}`,
  );
}

writeFileSync(
  join(consumer, "consumer.mjs"),
  `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createElement } from 'remix/component';
import { renderToString } from 'remix/component/server';
import { ActionButton, Icon } from 'remix-ai-elements/primitives';
import { Message, MessageContent } from 'remix-ai-elements/message';
import { Markdown } from 'remix-ai-elements/markdown';
const require = createRequire(import.meta.url);
assert.throws(() => require.resolve('ai'), { code: 'MODULE_NOT_FOUND' });
const html = await renderToString(createElement(Message, {}, createElement(MessageContent, {}, createElement(Markdown, { content: '**Packed consumer**' }))));
assert.ok(html.includes('<strong>Packed consumer</strong>'));
const primitiveHtml = await renderToString(createElement('div', {},
  createElement(Icon, { name: 'check' }),
  createElement(ActionButton, {}, 'Primitive consumer'),
));
assert.ok(primitiveHtml.includes('<svg'));
assert.ok(primitiveHtml.includes('Primitive consumer'));
for (const name of ['message-scroller', 'prompt-input', 'trace', 'reasoning', 'tool', 'code-block', 'theme', 'chain-of-thought', 'checkpoint', 'confirmation', 'context', 'file-tree', 'inline-citation', 'model-selector', 'plan', 'queue', 'sources', 'stack-trace', 'subagent', 'suggestion', 'task', 'terminal', 'test-results', 'primitives']) await import('remix-ai-elements/' + name);
for (const name of ['remix-ai-elements/internal/icon', 'remix-ai-elements/dist/internal/icon']) {
  assert.throws(() => import.meta.resolve(name), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
}
for (const name of ['react', 'react-dom', 'tailwindcss', '@ai-sdk/react']) {
  assert.throws(() => require.resolve(name), { code: 'MODULE_NOT_FOUND' });
}
console.log('Packed exports, primitives, SSR and dependency isolation passed.');
`,
);
execFileSync(process.execPath, ["consumer.mjs"], {
  cwd: consumer,
  stdio: "inherit",
});

writeFileSync(
  join(consumer, "consumer.mts"),
  `import { ActionButton, Icon, focusRing, scrollbarStyle, type IconName } from 'remix-ai-elements/primitives';
import { Message, type MessageProps } from 'remix-ai-elements/message';
import { CodeBlock, type CodeBlockProps } from 'remix-ai-elements/code-block';
const iconName: IconName = 'check';
const message: MessageProps = { from: 'user', children: 'Hello' };
const code: CodeBlockProps = { code: 'const a = 1;', lineNumbers: true };
const primitives = { ActionButton, Icon, focusRing, scrollbarStyle, iconName };
export { Message, ActionButton, Icon, message, code, primitives };
` +
    [
      "chain-of-thought",
      "checkpoint",
      "confirmation",
      "context",
      "file-tree",
      "inline-citation",
      "model-selector",
      "plan",
      "queue",
      "sources",
      "stack-trace",
      "subagent",
      "suggestion",
      "task",
      "terminal",
      "test-results",
    ]
      .map(
        (name, index) =>
          `import * as component${index} from 'remix-ai-elements/${name}'; export { component${index} };`,
      )
      .join("\n"),
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

copyFileSync(
  resolve(root, "examples/playground/server.ts"),
  join(playground, "server.ts"),
);
copyFileSync(
  resolve(root, "examples/playground/remix.json"),
  join(playground, "remix.json"),
);
copyFileSync(
  resolve(root, "examples/playground/tsconfig.json"),
  join(playground, "tsconfig.json"),
);
cpSync(resolve(root, "examples/playground/app"), join(playground, "app"), {
  recursive: true,
});
copyFileSync(
  resolve(root, "examples/shared/fixtures.ts"),
  join(shared, "fixtures.ts"),
);
delete playgroundPackage.dependenciesMeta;
playgroundPackage.dependencies["remix-ai-elements"] = packageSpec;
writeFileSync(
  join(playground, "package.json"),
  `${JSON.stringify(playgroundPackage, null, 2)}\n`,
);
const consumerManifest = JSON.parse(
  readFileSync(join(consumer, "package.json"), "utf8"),
);
consumerManifest.workspaces = ["examples/playground"];
writeFileSync(
  join(consumer, "package.json"),
  `${JSON.stringify(consumerManifest, null, 2)}\n`,
);
execFileSync(
  "npm",
  ["install", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: consumer, stdio: "inherit" },
);
const installedAi = realpathSync(join(consumer, "node_modules", "ai"));
assert.equal(
  JSON.parse(readFileSync(join(installedAi, "package.json"), "utf8")).version,
  aiVersion,
);

writeFileSync(
  join(consumer, "consumer-ai.mjs"),
  `
import assert from 'node:assert/strict';
import { Chat, createChat, DefaultChatTransport } from 'remix-ai-elements/ai-sdk';
const chat = new Chat({ id: 'packed-ai-consumer' });
const resolved = import.meta.resolve('remix-ai-elements/ai-sdk');
const browserCondition = process.execArgv.includes('--conditions=browser');
assert.ok(resolved.endsWith(browserCondition ? '/dist/ai-sdk.browser.js' : '/dist/ai-sdk.js'), resolved);
assert.equal(chat.status, 'ready');
assert.equal(typeof createChat, 'function');
assert.equal(typeof DefaultChatTransport, 'function');
await chat.dispose();
console.log('Packed AI SDK runtime export passed.');
`,
);
execFileSync(process.execPath, ["consumer-ai.mjs"], {
  cwd: consumer,
  stdio: "inherit",
});
execFileSync(process.execPath, ["--conditions=browser", "consumer-ai.mjs"], {
  cwd: consumer,
  stdio: "inherit",
});

writeFileSync(
  join(consumer, "consumer-ai.mts"),
  `import { Chat, createChat } from 'remix-ai-elements/ai-sdk';
import type { UIMessage } from 'ai';
import type { Handle } from 'remix/component';
declare const handle: Handle;
const chat = createChat(handle, { id: 'packed-ai-types' });
const standalone = new Chat<UIMessage>({ id: 'packed-ai-standalone' });
const message: UIMessage | undefined = chat.messages.at(0);
void chat.sendMessage({ text: 'Hello, packed consumer' });
void standalone.dispose();
export { chat, message };
`,
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
    "consumer-ai.mts",
  ],
  { cwd: consumer, stdio: "inherit" },
);
console.log("Packed AI SDK declarations passed in an isolated consumer.");

execFileSync(
  process.execPath,
  [
    resolve(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "-p",
    join(playground, "tsconfig.json"),
  ],
  { cwd: consumer, stdio: "inherit" },
);
console.log("Copied Playground typecheck passed.");

const remixBin = join(consumer, "node_modules", ".bin", "remix");
assert.ok(existsSync(remixBin), `Expected installed Remix CLI at ${remixBin}`);
execFileSync(remixBin, ["assets"], {
  cwd: playground,
  env: { ...process.env, NODE_ENV: "production" },
  stdio: "inherit",
});
execFileSync(remixBin, ["test"], {
  cwd: playground,
  env: { ...process.env, NODE_ENV: "test" },
  stdio: "inherit",
});

writeFileSync(
  join(consumer, "asset-graph-check.ts"),
  `
import assert from 'node:assert/strict';
import { builtinModules } from 'node:module';
import { assets, scriptEntry } from './examples/playground/app/assets.ts';
import { router } from './examples/playground/app/router.ts';

const assetResponse = async (href) => {
  const response = await assets.fetch(new Request(new URL(href, 'http://localhost')));
  assert.ok(response, \`Asset server did not handle \${href}\`);
  assert.equal(response.status, 200, \`Unexpected status for \${href}\`);
  assert.match(response.headers.get('content-type') ?? '', /javascript|ecmascript/);
  const source = await response.text();
  assert.ok(source.trim().length > 0, \`Empty asset response for \${href}\`);
  return source;
};

try {
  const page = await router.fetch(new Request('http://localhost/'));
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(html.includes(\`src="\${scriptEntry.href}"\`));
  for (const preload of scriptEntry.preloads) {
    assert.ok(html.includes(\`href="\${preload}"\`), \`SSR omitted preload \${preload}\`);
  }

  const packageEntry = await assets.getScriptEntry(
    'app/actions/public/package-exports.ts',
  );
  const packageImports = Object.assign(
    {},
    packageEntry.importMap.imports,
    ...Object.values(packageEntry.importMap.scopes ?? {}),
  );
  const aliases = ['message', 'theme', 'primitives', 'ai-sdk'];
  const packageHrefs = aliases.map((name) => {
    const href = packageImports[\`remix-ai-elements/\${name}\`];
    assert.ok(href, \`Missing import-map entry for \${name}\`);
    return href;
  });
  const aiSdkHref = packageHrefs.at(-1);
  const aiSdkAssetPath = decodeURIComponent(
    new URL(aiSdkHref, 'http://localhost').pathname,
  );
  assert.ok(
    aiSdkAssetPath.endsWith('/remix-ai-elements/dist/ai-sdk.browser.js'),
    \`Unexpected browser AI SDK asset: \${aiSdkHref}\`,
  );
  let aiSdkSource = '';
  for (const href of new Set([
    scriptEntry.href,
    ...scriptEntry.preloads,
    packageEntry.href,
    ...packageEntry.preloads,
    ...packageHrefs,
  ])) {
    const source = await assetResponse(href);
    if (href === aiSdkHref) aiSdkSource = source;
  }
  assert.ok(aiSdkSource.length > 0, 'Missing browser AI SDK asset response');
  const runtimeImports = [
    ...aiSdkSource.matchAll(/(?:^|\\n|;)\\s*import\\s+(?:[^'"]*?\\s+from\\s*)?["']([^"']+)["']/g),
    ...aiSdkSource.matchAll(/(?:^|\\n)\\s*export\\s+[^'"]*?\\s+from\\s*["']([^"']+)["']/g),
    ...aiSdkSource.matchAll(/\\bimport\\s*\\(\\s*["']([^"']+)["']\\s*\\)/g),
    ...aiSdkSource.matchAll(/\\brequire\\s*\\(\\s*["']([^"']+)["']\\s*\\)/g),
  ].map((match) => match[1]);
  const nodeBuiltins = new Set([
    ...builtinModules,
    ...builtinModules.map((name) => \`node:\${name}\`),
  ]);
  assert.deepEqual(
    runtimeImports.filter(
      (specifier) =>
        specifier === 'ai' ||
        specifier.startsWith('ai/') ||
        specifier === '@ai-sdk/gateway' ||
        specifier.startsWith('@ai-sdk/gateway/') ||
        nodeBuiltins.has(specifier),
    ),
    [],
    'Browser AI SDK entry imports Node builtins or server SDK modules',
  );

  for (const path of [
    '/assets/app/actions/controller.tsx',
    '/assets/app/assets.ts',
    '/assets/app/actions/controller.test.ts',
    '/assets/app/actions/chat.ts',
    '/assets/app/actions/demo-model.ts',
    '/assets/app/not-a-module.ts',
  ]) {
    const response = await router.fetch(new Request(\`http://localhost\${path}\`));
    assert.equal(response.status, 404, \`Private or missing path was served: \${path}\`);
  }
  console.log(\`Consumer asset graph passed: \${packageHrefs.join(', ')}\`);
} finally {
  await assets.close();
}
`,
);
execFileSync(
  process.execPath,
  ["--import", "remix/node-tsx", "asset-graph-check.ts"],
  { cwd: consumer, stdio: "inherit" },
);

console.log(`Isolated consumer retained at ${consumer}`);

async function preparePackageArchive(input) {
  if (input === undefined) {
    const pack = JSON.parse(
      execFileSync("npm", ["pack", "--json", "--pack-destination", consumer], {
        cwd: resolve(root, "packages/remix-ai-elements"),
        encoding: "utf8",
      }),
    )[0];
    assert.ok(pack.files.every((file) => !file.path.startsWith("examples/")));
    assert.ok(pack.files.some((file) => file.path === "dist/primitives.js"));
    assert.ok(pack.files.some((file) => file.path === "dist/primitives.d.ts"));
    return join(consumer, pack.filename);
  }

  if (input.startsWith("https://")) {
    const response = await fetch(input);
    assert.ok(
      response.ok,
      `Release tarball download failed: HTTP ${response.status}`,
    );
    const archive = join(consumer, "remix-ai-elements-release.tgz");
    writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
    return archive;
  }

  assert.ok(
    !input.includes("://"),
    "Tarball argument must be a local path or HTTPS URL",
  );
  const source = resolve(process.cwd(), input);
  assert.ok(statSync(source).isFile(), `Tarball path is not a file: ${source}`);
  const archive = join(consumer, basename(source));
  copyFileSync(source, archive);
  return archive;
}
