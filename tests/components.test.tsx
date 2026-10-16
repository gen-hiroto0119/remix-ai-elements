import assert from "node:assert/strict";
import test from "node:test";
import { renderToString } from "remix/component/server";
import { CodeBlock } from "../packages/remix-ai-elements/src/code-block.js";
import { Markdown } from "../packages/remix-ai-elements/src/markdown.js";
import {
  Message,
  MessageBubble,
  MessageContent,
} from "../packages/remix-ai-elements/src/message.js";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "../packages/remix-ai-elements/src/prompt-input.js";
import { Reasoning } from "../packages/remix-ai-elements/src/reasoning.js";
import { darkTheme } from "../packages/remix-ai-elements/src/theme.js";
import { Tool } from "../packages/remix-ai-elements/src/tool.js";

function controlledDisclosureTypes() {
  // @ts-expect-error Controlled open requires onOpenChange.
  const invalidReasoning = <Reasoning open />;
  // @ts-expect-error Controlled open requires onOpenChange.
  const invalidTool = <Tool name="Search" open />;
  const validReasoning = (
    <Reasoning open onOpenChange={() => {}}>
      Reasoning
    </Reasoning>
  );
  const validTool = <Tool name="Search" open onOpenChange={() => {}} />;
  return [invalidReasoning, invalidTool, validReasoning, validTool];
}

void controlledDisclosureTypes;

test("components render with Remix styles and no browser globals", async () => {
  const html = await renderToString(
    <html lang="en">
      <head />
      <body>
        <main mix={darkTheme}>
          <Message from="user" aria-label="Question">
            <MessageContent>
              <MessageBubble>Hello, Remix</MessageBubble>
            </MessageContent>
          </Message>
          <Reasoning duration={5} defaultOpen>
            Check the theme first.
          </Reasoning>
          <Tool
            name="Search"
            status="error"
            defaultOpen
            input='{"query":"theme"}'
            output="Permission denied"
          />
          <PromptInput>
            <PromptInputTextarea aria-label="Your message" />
            <PromptInputSubmit disabled />
          </PromptInput>
        </main>
      </body>
    </html>,
  );
  assert.match(html, /data-rmx-style/);
  assert.match(html, /--reai-background/);
  assert.match(html, /data-align="end"/);
  assert.match(html, /Hello, Remix/);
  assert.match(html, /Thought for 5s/);
  assert.match(html, /<details[^>]*open/);
  assert.match(html, /Permission denied/);
  assert.match(html, /data-status="error"/);
  assert.match(html, /aria-label="Your message"/);
});

test("Markdown renders structure but never runs HTML or unsafe URLs", async () => {
  const html = await renderToString(
    <Markdown
      content={
        '## Heading\n\n**Strong** and `inline`.\n\n- First\n- Second\n\n[Safe](https://remix.run) [Unsafe](javascript:alert%281%29)\n\n<img src=x onerror=alert(1)>\n\n```ts\nconst html = "<script>";\n```'
      }
    />,
  );
  assert.match(html, /<h2>Heading<\/h2>/);
  assert.match(html, /<strong>Strong<\/strong>/);
  assert.match(html, /<ul>/);
  assert.match(html, /href="https:\/\/remix.run"/);
  assert.doesNotMatch(html, /href="javascript:/);
  assert.doesNotMatch(html, /<img|<script>/);
  assert.match(html, /&lt;img/);
  assert.match(html, /data-slot="code-block"/);
});

test("Markdown renders reference links without exposing definitions", async () => {
  const html = await renderToString(
    <Markdown content={"[Docs][docs]\n\n[docs]: https://remix.run"} />,
  );
  assert.match(html, /<a[^>]*href="https:\/\/remix\.run"[^>]*>Docs<\/a>/);
  assert.doesNotMatch(html, /\[docs\]:/);
});

test("CodeBlock preserves literal content and exposes copy and wrapping controls", async () => {
  const html = await renderToString(
    <CodeBlock
      code={"<h1>Hello</h1>\nconst count = 2;"}
      filename="demo.tsx"
      lineNumbers
      wrap
    />,
  );
  assert.match(html, /demo.tsx/);
  assert.match(html, /&lt;h1&gt;Hello&lt;\/h1&gt;/);
  assert.match(html, /aria-label="Copy code"/);
  assert.match(html, /data-wrap="true"/);
  assert.match(html, /data-line="2"/);
});
