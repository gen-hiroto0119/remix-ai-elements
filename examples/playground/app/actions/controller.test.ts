import * as assert from "remix/assert";
import { describe, it } from "remix/test";
import { assets, scriptEntry } from "../assets.ts";
import { router } from "../router.ts";

describe("playground controller", () => {
  it("renders the catalog in the initial HTML with a browser entry", async () => {
    const response = await router.fetch(new Request("http://localhost/"));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("Content-Type") ?? "", /text\/html/);
    const html = await response.text();
    assert.match(html, /Introduction/);
    assert.match(html, /File Tree/);
    assert.match(html, /Suggestion/);
    assert.match(html, /type="importmap"/);
    assert.match(html, /type="module"/);
    assert.match(html, /rel="icon"[^>]+href="data:image\/svg\+xml,/);
  });

  it("serves health checks and rejects private or missing modules", async () => {
    const health = await router.fetch(new Request("http://localhost/health"));
    assert.equal(health.status, 200);
    assert.equal(await health.text(), "ok");
    for (const path of [
      "/missing",
      "/assets/app/assets.ts",
      "/assets/app/actions/controller.tsx",
      "/assets/app/actions/controller.test.ts",
      "/assets/app/actions/chat.ts",
      "/assets/app/actions/demo-model.ts",
      "/assets/shared/not-a-fixture.ts",
    ]) {
      const response = await router.fetch(
        new Request(`http://localhost${path}`),
      );
      assert.equal(response.status, 404);
    }
  });

  it("serves public package entries through the browser asset graph", async () => {
    const document = await router.fetch(new Request("http://localhost/"));
    const html = await document.text();
    assert.ok(html.includes(`src="${scriptEntry.href}"`));

    for (const preload of scriptEntry.preloads) {
      assert.ok(html.includes(`href="${preload}"`));
    }

    const packageEntry = await assets.getScriptEntry(
      "app/actions/public/package-exports.ts",
    );
    const packageImports = Object.assign(
      {},
      packageEntry.importMap.imports,
      ...Object.values(packageEntry.importMap.scopes ?? {}),
    );
    const packageHrefs = ["message", "theme", "primitives", "ai-sdk"].map(
      (name) => {
        const href = packageImports[`remix-ai-elements/${name}`];
        assert.ok(href);
        return href;
      },
    );

    for (const href of new Set([
      scriptEntry.href,
      ...scriptEntry.preloads,
      packageEntry.href,
      ...packageEntry.preloads,
      ...packageHrefs,
    ])) {
      assert.ok(
        !/\/\./.test(
          decodeURIComponent(new URL(href, "http://localhost").pathname),
        ),
      );
      const response = await assets.fetch(
        new Request(new URL(href, "http://localhost")),
      );
      assert.ok(response);
      assert.equal(response.status, 200);
      assert.match(
        response.headers.get("Content-Type") ?? "",
        /javascript|ecmascript/,
      );
      assert.ok((await response.text()).trim().length > 0);
    }
  });
});
