import { css, type Handle, on } from "remix/component";
import { createChat, DefaultChatTransport } from "remix-ai-elements/ai-sdk";
import { Markdown } from "remix-ai-elements/markdown";
import {
  Message,
  MessageBubble,
  MessageContent,
} from "remix-ai-elements/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
} from "remix-ai-elements/message-scroller";
import { ActionButton } from "remix-ai-elements/primitives";
import {
  PromptInput,
  PromptInputStop,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "remix-ai-elements/prompt-input";
import { tokens as t } from "remix-ai-elements/theme";
import { previewStyles } from "../shared/preview-styles.ts";

const controls = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
  fontSize: "12px",
  color: t.subtle,
});
const select = css({
  maxWidth: "100%",
  border: `1px solid ${t.border}`,
  borderRadius: "6px",
  padding: "5px",
  background: t.background,
  color: t.foreground,
});
const errorStyle = css({
  color: t.destructive,
  fontSize: "13px",
  margin: "8px 0",
});

export function StreamingChatPreview(handle: Handle) {
  let mode = "success";
  let operationError: string | undefined;
  const chat = createChat(handle, {
    id: `streaming-demo-${handle.id}`,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ mode }),
    }),
  });
  const conversationId = `streaming-conversation-${handle.id}`;
  const busy = () => chat.status === "submitted" || chat.status === "streaming";
  const run = async (operation: () => Promise<unknown>) => {
    operationError = undefined;
    try {
      await operation();
    } catch {
      operationError = "The operation failed. Please try again.";
    }
    if (!handle.signal.aborted) void handle.update();
  };

  return () => (
    <>
      <div mix={previewStyles.chatHeader}>
        <div>
          <h2 mix={previewStyles.chatTitle}>Streaming demo</h2>
          <p mix={previewStyles.chatDescription}>
            Real HTTP / SSE · Simulated model · No API key
          </p>
        </div>
        <span
          role="status"
          aria-label="Chat status"
          data-chat-status={chat.status}
          mix={controls}
        >
          {chat.status}
        </span>
      </div>
      <MessageScroller
        id={conversationId}
        autoScroll
        aria-busy={busy()}
        mix={previewStyles.chatBody}
      >
        <MessageScrollerContent mix={previewStyles.chatContent}>
          {chat.messages.length === 0 ? (
            <p mix={previewStyles.muted}>
              Send a message to try streaming. The response is a fixed demo, not
              an AI-generated answer.
            </p>
          ) : (
            chat.messages.map((message) => (
              <Message
                key={message.id}
                from={message.role === "user" ? "user" : "assistant"}
              >
                <MessageContent>
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      message.role === "user" ? (
                        <MessageBubble key={index}>{part.text}</MessageBubble>
                      ) : (
                        <Markdown key={index} content={part.text} />
                      )
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </MessageScrollerContent>
      </MessageScroller>
      <div mix={previewStyles.composer}>
        <div mix={[controls, css({ marginBottom: "12px" })]}>
          <label>
            Demo response{" "}
            <select
              aria-label="Demo response"
              disabled={busy()}
              mix={[
                select,
                on("change", (event) => {
                  mode = event.currentTarget.value;
                  void handle.update();
                }),
              ]}
            >
              <option value="success" selected={mode === "success"}>
                Success
              </option>
              <option value="http-error" selected={mode === "http-error"}>
                HTTP error
              </option>
              <option value="stream-error" selected={mode === "stream-error"}>
                Stream error
              </option>
            </select>
          </label>
          <ActionButton
            disabled={busy() || chat.messages.length === 0}
            mix={on("click", () => void run(() => chat.regenerate()))}
          >
            {chat.status === "error" ? "Retry response" : "Regenerate"}
          </ActionButton>
          <ActionButton
            disabled={busy() || chat.messages.length === 0}
            mix={on("click", () => {
              chat.messages = [];
              chat.clearError();
              operationError = undefined;
              void handle.update();
            })}
          >
            Clear chat
          </ActionButton>
          <MessageScrollerButton targetId={conversationId} />
        </div>
        {chat.error || operationError ? (
          <p role="alert" mix={errorStyle}>
            {operationError ?? chat.error?.message}
          </p>
        ) : null}
        <PromptInput
          status={chat.status}
          aria-label="Streaming chat prompt"
          mix={on("submit", (event) => {
            event.preventDefault();
            if (busy()) return;
            const form = event.currentTarget;
            const text = String(new FormData(form).get("message") ?? "").trim();
            if (!text) return;
            form.reset();
            void run(() => chat.sendMessage({ text }));
          })}
        >
          <PromptInputTextarea
            name="message"
            aria-label="Your message"
            placeholder="Try the streaming connection…"
            maxLength={2_000}
            disabled={busy()}
            mix={on("keydown", (event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.isComposing
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            })}
          />
          <PromptInputToolbar>
            <span>Mock model · Text only</span>
            {busy() ? (
              <PromptInputStop
                mix={on("click", () => void run(() => chat.stop()))}
              />
            ) : (
              <PromptInputSubmit />
            )}
          </PromptInputToolbar>
        </PromptInput>
        <p mix={previewStyles.note}>
          No external AI service or persistence. Leaving this page stops the
          request and clears the chat.
        </p>
      </div>
    </>
  );
}
