import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";
import {
  createUIMessageStreamResponse,
  DefaultChatTransport,
  type UIMessage,
  type UIMessageChunk,
} from "ai";
import { createRequestListener } from "remix/node-fetch-server";
import { chatResponse } from "../examples/playground/app/actions/chat.ts";
import { Chat, createChat } from "../packages/remix-ai-elements/src/ai-sdk.ts";

function text(messages: UIMessage[]) {
  return (
    messages
      .findLast((message) => message.role === "assistant")
      ?.parts.filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("") ?? ""
  );
}

test("AI SDK binding sends the standard request, publishes detached snapshots, and regenerates", async () => {
  const requests: Array<Record<string, unknown>> = [];
  const chat = new Chat({
    id: "chat-test",
    transport: new DefaultChatTransport({
      fetch: async (_url, init) => {
        requests.push(JSON.parse(String(init?.body)));
        return createUIMessageStreamResponse({
          stream: new ReadableStream<UIMessageChunk>({
            start(controller) {
              for (const chunk of [
                { type: "start", messageId: `assistant-${requests.length}` },
                { type: "text-start", id: "text" },
                { type: "text-delta", id: "text", delta: "Hello" },
                { type: "text-delta", id: "text", delta: " Remix" },
                { type: "text-end", id: "text" },
                { type: "finish", finishReason: "stop" },
              ] as UIMessageChunk[])
                controller.enqueue(chunk);
              controller.close();
            },
          }),
        });
      },
    }),
  });
  const states: string[] = [];
  const snapshots: UIMessage[][] = [];
  let partial: UIMessage[] | undefined;
  const unsubscribe = chat.subscribe(() => {
    states.push(chat.status);
    snapshots.push(chat.messages);
    if (text(chat.messages) === "Hello") partial = chat.messages;
  });
  await chat.sendMessage({ text: "Question" });
  assert.equal(chat.status, "ready");
  assert.ok(states.includes("submitted"));
  assert.ok(states.includes("streaming"));
  assert.equal(text(chat.messages), "Hello Remix");
  assert.ok(partial);
  assert.equal(text(partial), "Hello");
  assert.equal(requests[0].id, "chat-test");
  assert.equal(requests[0].trigger, "submit-message");
  await chat.regenerate();
  assert.equal(chat.messages.length, 2);
  assert.equal(requests[1].trigger, "regenerate-message");
  unsubscribe();
  const count = snapshots.length;
  chat.messages = [];
  assert.equal(snapshots.length, count);
  await chat.dispose();
});

test("AI SDK binding handles HTTP and in-stream errors and retries", async () => {
  for (const mode of ["http-error", "stream-error"]) {
    let fail = true;
    const chat = new Chat({
      transport: new DefaultChatTransport({
        fetch: async () => {
          if (fail && mode === "http-error")
            return new Response("Unavailable", { status: 503 });
          return createUIMessageStreamResponse({
            stream: new ReadableStream<UIMessageChunk>({
              start(controller) {
                controller.enqueue({ type: "start" });
                if (fail)
                  controller.enqueue({
                    type: "error",
                    errorText: "Broken stream",
                  });
                else {
                  controller.enqueue({ type: "text-start", id: "retry" });
                  controller.enqueue({
                    type: "text-delta",
                    id: "retry",
                    delta: "Recovered",
                  });
                  controller.enqueue({ type: "text-end", id: "retry" });
                  controller.enqueue({ type: "finish", finishReason: "stop" });
                }
                controller.close();
              },
            }),
          });
        },
      }),
    });
    await chat.sendMessage({ text: "Retry test" });
    assert.equal(chat.status, "error");
    assert.ok(chat.error);
    fail = false;
    await chat.regenerate();
    assert.equal(chat.status, "ready");
    assert.equal(chat.error, undefined);
    assert.equal(text(chat.messages), "Recovered");
    await chat.dispose();
  }
});

test(
  "real streamed assistant step history can be sent again",
  { timeout: 10_000 },
  async () => {
    const server = createServer(createRequestListener(chatResponse));
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const chat = new Chat({
      id: "step-history",
      transport: new DefaultChatTransport({
        api: `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/chat`,
      }),
    });
    try {
      await chat.sendMessage({ text: "First question" });
      assert.equal(chat.status, "ready");
      assert.ok(
        chat.messages
          .findLast((message) => message.role === "assistant")
          ?.parts.some((part) => part.type === "step-start"),
      );
      await chat.sendMessage({ text: "Follow-up question" });
      assert.equal(chat.status, "ready");
      assert.equal(
        chat.messages.filter((message) => message.role === "assistant").length,
        2,
      );
    } finally {
      await chat.dispose();
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
);

test(
  "Chat.stop aborts an HTTP stream and retains the partial response",
  { timeout: 10_000 },
  async () => {
    const disconnected = Promise.withResolvers<void>();
    const server = createServer(
      createRequestListener((request) => {
        request.signal.addEventListener("abort", () => disconnected.resolve(), {
          once: true,
        });
        return chatResponse(request);
      }),
    );
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const chat = new Chat({
      transport: new DefaultChatTransport({
        api: `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/chat`,
      }),
    });
    const partial = Promise.withResolvers<void>();
    const unsubscribe = chat.subscribe(() => {
      if (chat.status === "streaming" && text(chat.messages)) partial.resolve();
    });
    try {
      const sending = chat.sendMessage({ text: "Stop this stream" });
      await partial.promise;
      const stoppedText = text(chat.messages);
      await chat.stop();
      await sending;
      await disconnected.promise;
      assert.equal(chat.status, "ready");
      assert.ok(stoppedText.length > 0);
      assert.equal(text(chat.messages), stoppedText);
    } finally {
      unsubscribe();
      await chat.dispose();
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
);

test(
  "Remix owner disposal aborts HTTP streaming and stops updates",
  { timeout: 10_000 },
  async () => {
    const disconnected = Promise.withResolvers<void>();
    const server = createServer(
      createRequestListener((request) => {
        request.signal.addEventListener("abort", () => disconnected.resolve(), {
          once: true,
        });
        return chatResponse(request);
      }),
    );
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const owner = new AbortController();
    let updates = 0;
    const partial = Promise.withResolvers<void>();
    const chat = createChat(
      {
        signal: owner.signal,
        update: async () => {
          updates++;
          return owner.signal;
        },
      },
      {
        transport: new DefaultChatTransport({
          api: `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/chat`,
        }),
      },
    );
    const unsubscribe = chat.subscribe(() => {
      if (chat.status === "streaming" && text(chat.messages)) partial.resolve();
    });
    try {
      const sending = chat.sendMessage({ text: "Stop this stream" });
      await partial.promise;
      owner.abort();
      const count = updates;
      await sending;
      await disconnected.promise;
      assert.equal(updates, count);
      assert.equal(chat.status, "ready");
      assert.ok(text(chat.messages).length > 0);
      assert.ok(text(chat.messages).length < 500);
    } finally {
      unsubscribe();
      await chat.dispose();
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
);

test("createChat construction is isolated and does not fetch during SSR setup", async () => {
  let calls = 0;
  const transport = new DefaultChatTransport({
    fetch: async () => {
      calls++;
      throw new Error("Unexpected request");
    },
  });
  const owner = new AbortController();
  const handle = { signal: owner.signal, update: async () => owner.signal };
  const one = createChat(handle, { id: "one", transport });
  const two = createChat(handle, { id: "two", transport });
  one.messages = [
    { id: "user", role: "user", parts: [{ type: "text", text: "private" }] },
  ];
  assert.equal(two.messages.length, 0);
  assert.equal(calls, 0);
  owner.abort();
  await Promise.all([one.dispose(), two.dispose()]);
});
