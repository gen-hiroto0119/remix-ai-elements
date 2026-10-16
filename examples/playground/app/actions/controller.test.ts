import * as assert from "remix/assert";
import { describe, it } from "remix/test";
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
      "/assets/shared/not-a-fixture.ts",
    ]) {
      const response = await router.fetch(
        new Request(`http://localhost${path}`),
      );
      assert.equal(response.status, 404);
    }
  });
});
