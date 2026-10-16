import assert from "node:assert/strict";
import test from "node:test";
import { renderToString } from "remix/component/server";
import {
  CatalogPreview,
  catalogDescriptions,
} from "../examples/playground/src/catalog.js";
import { Context } from "../packages/remix-ai-elements/src/context.js";
import { sourceUrl } from "../packages/remix-ai-elements/src/internal/source.js";
import { Sources } from "../packages/remix-ai-elements/src/sources.js";
import { TestResults } from "../packages/remix-ai-elements/src/test-results.js";

test("all sixteen additional patterns SSR without browser globals", async () => {
  for (const page of Object.keys(
    catalogDescriptions,
  ) as (keyof typeof catalogDescriptions)[]) {
    const html = await renderToString(<CatalogPreview page={page} />);
    assert.ok(html.includes("Visual preview only"), page);
  }
});
test("context clamps progress and avoids non-finite usage", async () => {
  const empty = await renderToString(
    <Context input={Number.NaN} output={-1} limit={0} />,
  );
  assert.match(empty, /Context unavailable/);
  assert.doesNotMatch(empty, /NaN|Infinity/);
  const full = await renderToString(
    <Context input={120} output={10} limit={100} />,
  );
  assert.match(full, /130% context/);
  assert.match(full, /value="100"/);
});
test("sources reject executable URLs and escape titles", async () => {
  assert.equal(sourceUrl("javascript:alert(1)"), undefined);
  assert.equal(sourceUrl("data:text/html,x"), undefined);
  const html = await renderToString(
    <Sources
      defaultOpen
      sources={[
        { id: "x", title: "<script>bad</script>", url: "javascript:alert(1)" },
      ]}
    />,
  );
  assert.doesNotMatch(html, /href="javascript:|<script>/);
  assert.match(html, /&lt;script&gt;/);
});
test("test results count nested failures and preserve escaped diagnostics", async () => {
  const html = await renderToString(
    <TestResults
      suites={[
        {
          id: "s",
          name: "suite",
          tests: [
            { id: "1", name: "passes", status: "passed" },
            {
              id: "2",
              name: "fails",
              status: "failed",
              error: "Expected <button>",
            },
            { id: "3", name: "later", status: "skipped" },
          ],
        },
      ]}
    />,
  );
  assert.match(html, /3 tests, 1 failed, 1 skipped/);
  assert.match(html, /Expected &lt;button&gt;/);
  assert.match(html, /<details[^>]*open/);
});
