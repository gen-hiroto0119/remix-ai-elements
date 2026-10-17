import { setTimeout as delay } from "node:timers/promises";
import { MockLanguageModelV4 } from "ai/test";

type ModelStream = Awaited<
  ReturnType<MockLanguageModelV4["doStream"]>
>["stream"];
type ModelChunk = ModelStream extends ReadableStream<infer CHUNK>
  ? CHUNK
  : never;

const reply = `This is a **simulated response**, streamed through the real AI SDK and Remix server. No external model is called.

### How the connection works

1. The browser sends your message to a Remix action.
2. AI SDK turns model events into a UI Message Stream.
3. Each text delta updates the conversation through the Remix binding.

\`\`\`ts
const chat = createChat(handle, { transport });
await chat.sendMessage({ text: "Hello, Remix!" });
\`\`\`

Try **Stop generation** while this answer is arriving. The partial response stays visible. You can also regenerate, or switch the demo response to an error and retry.

This demo has no persistence: leaving this page clears the conversation. A real provider can replace the mock model in the server action without changing the browser transport.`;

export function createDemoModel(fail = false, delayMs = 45) {
  return new MockLanguageModelV4({
    doStream: async ({ abortSignal }) => {
      const chunks: ModelChunk[] = [
        { type: "stream-start", warnings: [] },
        { type: "text-start", id: "demo-text" },
        ...Array.from(
          reply.matchAll(/.{1,18}/gs),
          ([delta]): ModelChunk => ({
            type: "text-delta",
            id: "demo-text",
            delta,
          }),
        ),
        { type: "text-end", id: "demo-text" },
        {
          type: "finish",
          finishReason: { unified: "stop", raw: undefined },
          usage: {
            inputTokens: {
              total: 0,
              noCache: 0,
              cacheRead: undefined,
              cacheWrite: undefined,
            },
            outputTokens: { total: 0, text: 0, reasoning: undefined },
          },
        },
      ];
      const cancellation = new AbortController();
      const signal = abortSignal
        ? AbortSignal.any([abortSignal, cancellation.signal])
        : cancellation.signal;
      let index = 0;
      return {
        stream: new ReadableStream<ModelChunk>({
          async pull(controller) {
            await delay(delayMs, undefined, { signal });
            if (fail && index === 8) {
              index++;
              controller.enqueue({
                type: "error",
                error: new Error("Simulated stream failure"),
              });
              controller.close();
            } else if (index === chunks.length) {
              controller.close();
            } else {
              controller.enqueue(chunks[index++]);
            }
          },
          cancel() {
            cancellation.abort();
          },
        }),
      };
    },
  });
}
