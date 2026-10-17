import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
} from "ai";
import { createDemoModel } from "./demo-model.ts";

const maxBodyBytes = 65_536;

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        throw new RangeError("Request too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

export async function chatResponse(request: Request): Promise<Response> {
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return new Response("Expected application/json", { status: 415 });
  }
  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return new Response("Invalid chat request", {
      status: error instanceof RangeError ? 413 : 400,
    });
  }
  if (!body || typeof body !== "object" || !("messages" in body)) {
    return new Response("Expected messages", { status: 400 });
  }
  const validated = await safeValidateUIMessages({ messages: body.messages });
  const mode = "mode" in body ? body.mode : "success";
  if (
    !validated.success ||
    !["success", "http-error", "stream-error"].includes(String(mode)) ||
    validated.data.length === 0 ||
    validated.data.length > 40 ||
    !validated.data.some((message) => message.role === "user") ||
    validated.data.some(
      (message) =>
        !["user", "assistant"].includes(message.role) ||
        message.parts.length === 0 ||
        message.parts.some((part) =>
          part.type === "step-start"
            ? message.role !== "assistant"
            : part.type !== "text" || part.text.length > 8_000,
        ),
    )
  ) {
    return new Response(
      "Expected a text-only demo conversation (up to 40 messages)",
      { status: 400 },
    );
  }
  if (mode === "http-error") {
    return new Response("Simulated HTTP error. Choose Success, then retry.", {
      status: 503,
    });
  }

  const result = streamText({
    model: createDemoModel(mode === "stream-error"),
    messages: await convertToModelMessages(validated.data),
    abortSignal: request.signal,
    maxRetries: 0,
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: () => "Simulated stream error. Choose Success, then retry.",
    }),
  });
}
