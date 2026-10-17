# AI SDK binding (experimental)

The visual entrypoints remain usable without AI SDK. The optional
`remix-ai-elements/ai-sdk` entrypoint targets `ai@7.0.142`, Remix 3, and a modern
browser. Its public API is not yet stable.

```tsx
import { type Handle, on } from "remix/component";
import { createChat, DefaultChatTransport } from "remix-ai-elements/ai-sdk";

export function ChatExample(handle: Handle) {
  const chat = createChat(handle, {
    id: `example-${handle.id}`,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  return () => (
    <section>
      {chat.messages.map(message => <p key={message.id}>
        {message.parts.map(part => part.type === "text" ? part.text : null)}
      </p>)}
      <button type="button" disabled={chat.status === "submitted" || chat.status === "streaming"}
        mix={on("click", () => void chat.sendMessage({ text: "Hello!" }))}>Send</button>
      <button type="button" mix={on("click", () => void chat.stop())}>Stop</button>
    </section>
  );
}
```

The binding supplies observable `ChatState` to `AbstractChat`; AI SDK owns SSE
parsing, message assembly, status/error handling, regeneration, and tool state.
`createChat` is component-owned: unmount unsubscribes immediately and calls SDK
`dispose()` to abort work and close the transport. Use a separately owned `Chat`
only when a conversation must outlive a component, and explicitly unsubscribe
and dispose it. Await `stop()` before starting replacement work outside the UI.

## Server boundary

Define a POST route in `app/routes.ts`, connect it through the controller, and
return a Web Response. Keep validation, auth, model selection, secrets, tools,
and persistence server-side. Do not treat client-supplied tool approvals or
conversation history as trusted authorization.

The standard transport sends JSON containing `id`, `messages`, `trigger`, and
optional `messageId`. A server validates `UIMessage[]`, converts them using
`convertToModelMessages`, calls `streamText({ model, messages, abortSignal:
request.signal })`, and returns:

```ts
return createUIMessageStreamResponse({
  stream: toUIMessageStream({ stream: result.stream }),
});
```

Use the standalone helpers: the older result instance methods are deprecated.
The response uses `text/event-stream`, `x-vercel-ai-ui-message-stream: v1`,
and `x-accel-buffering: no`. This is the AI SDK UI Message Stream protocol, not a
provider's raw token stream. No chat-specific official OpenAPI schema was found
in the SDK docs or repository checked; an app may document its own HTTP API.

## Playground scope

`Streaming chat` sends real POST requests to `/api/chat`. The server uses
`streamText` with `MockLanguageModelV4`, emits a fixed answer in timed chunks,
and never calls an external provider. It accepts bounded text-only history,
including inert assistant `step-start` markers produced by the SDK; user
non-text and tool/file/source parts are rejected. It offers Success, HTTP error,
and Stream error modes. Choose Success and Retry
response after an injected error. Stop preserves partial text; Regenerate
replaces the last answer; Clear chat resets local history. Leaving the page
aborts the request and drops history. Existing visual catalog pages are unchanged.

`MessageScroller autoScroll` follows the bottom while the reader stays near it,
pauses when they scroll up, and resumes after returning to the bottom. Its
content should be inside `MessageScrollerContent` so resize observation can
follow streaming content. Auto-scroll is opt-in.

Only the `/ai-sdk` public entrypoint is added to the browser graph.
The server action and mock model remain private. The package consumer checks
cover both visual-only installation without `ai` and a packed AI-enabled app.

## Browser packaging

Remix's native asset server serves ESM without bundling CommonJS dependencies.
The SDK's public root also imports gateway dependencies, including CommonJS, so
it cannot be served directly in this setup. Our `browser` conditional export
therefore selects a prebundled, tree-shaken ESM binding built from the SDK's
public entrypoint. Node/SSR uses the ordinary unbundled entry and the app's
optional `ai` peer. No SDK internal subpaths or compatibility shims are used.

Import the browser's `DefaultChatTransport` from `remix-ai-elements/ai-sdk`,
not directly from `ai`. Type-only imports from `ai` remain safe. Other runtime
imports from `ai` in a native Remix browser entry would need their own bundling.
The browser build embeds the pinned development SDK version (`7.0.142`); updating
the application's `ai` dependency alone does not update that bundle. Rebuild and
release the component package to update it. `dist/ai-sdk.browser.NOTICES.txt`
contains licenses for third-party code included in the generated bundle.
Remix and the visual components are not bundled into this optional entrypoint.

## Not yet covered

- Real provider/model and credentials; replace the mock on the server later.
- Tool execution and approval UI end-to-end (SDK methods are inherited, but the
  demo intentionally accepts text only).
- Auth, billing/rate limiting, durable history, reconnect/resume.
- Cloud deployment of this change and Cloud-level streaming/cancellation tests.

Remix's Node adapter propagates client disconnects to `request.signal` and
cancels response readers. The mock also observes the signal, including an
already-aborted signal, rather than depending only on stream cancellation.
Cloud has additional proxy layers: source-level support is not proof of
incremental delivery or end-to-end cancellation there. Cloud's documented
request timeout does not establish an SSE lifetime limit. Deployment/scaling
can interrupt connections.

Resume is a separate design: it requires persisted streams/history and normally
a dedicated generation-stop endpoint. Do not add it implicitly to this initial
abort-on-disconnect flow.

## References

- https://ai-sdk.dev/docs/ai-sdk-ui/transport
- https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol
- https://ai-sdk.dev/docs/advanced/stopping-streams
- https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-resume-streams
- https://unpkg.com/ai@7.0.142/src/ui/chat.ts
- https://unpkg.com/@remix-run/node-fetch-server@1.0.0/src/lib/request-abort.ts
- https://laravel.com/cloud/docs/api/environments/update-environment
