import * as assert from "remix/assert";
import { describe, it } from "remix/test";
import { router } from "../router.ts";

const messages = [
  { id: "user", role: "user", parts: [{ type: "text", text: "Hello" }] },
];
const request = (body: unknown) =>
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("streaming demo action", () => {
  it("returns the SDK SSE protocol, completes, and masks stream failures", async () => {
    for (const mode of ["success", "stream-error"]) {
      const response = await router.fetch(request({ messages, mode }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-vercel-ai-ui-message-stream"), "v1");
      assert.equal(response.headers.get("x-accel-buffering"), "no");
      assert.match(
        response.headers.get("Content-Type") ?? "",
        /text\/event-stream/,
      );
      const text = await response.text();
      assert.match(text, /"type":"text-delta"/);
      assert.match(text, /data: \[DONE\]/);
      assert.match(
        text,
        mode === "success" ? /"type":"finish"/ : /Simulated stream error/,
      );
    }
  });
  it("rejects invalid, oversized and non-text input, and offers a controlled HTTP failure", async () => {
    for (const body of [
      null,
      {},
      { messages: [] },
      { messages: "bad" },
      { messages, mode: "unknown" },
      { messages: [{ ...messages[0], role: "system" }] },
      { messages: [{ ...messages[0], parts: [{ type: "step-start" }] }] },
      {
        messages: [
          {
            ...messages[0],
            parts: [
              {
                type: "file",
                mediaType: "image/png",
                url: "https://example.com/file.png",
              },
            ],
          },
        ],
      },
    ])
      assert.equal((await router.fetch(request(body))).status, 400);
    assert.equal(
      (await router.fetch(request({ messages, mode: "http-error" }))).status,
      503,
    );
    assert.equal(
      (await router.fetch(request({ messages, extra: "x".repeat(65_536) })))
        .status,
      413,
    );
    assert.equal(
      (
        await router.fetch(
          new Request("http://localhost/api/chat", {
            method: "POST",
            body: "{}",
          }),
        )
      ).status,
      415,
    );
    assert.equal(
      (
        await router.fetch(
          new Request("http://localhost/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{",
          }),
        )
      ).status,
      400,
    );
  });
});
