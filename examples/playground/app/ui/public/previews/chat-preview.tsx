import { css, type Handle } from "remix/component";
import { CodeBlockCopyButton } from "remix-ai-elements/code-block";
import { Markdown } from "remix-ai-elements/markdown";
import {
  Message,
  MessageActions,
  MessageBubble,
  MessageContent,
} from "remix-ai-elements/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
} from "remix-ai-elements/message-scroller";
import { Reasoning } from "remix-ai-elements/reasoning";
import { tokens as t } from "remix-ai-elements/theme";
import { Tool } from "remix-ai-elements/tool";
import { Trace } from "remix-ai-elements/trace";
import { Icon } from "../../../../../../packages/remix-ai-elements/dist/internal/icon.js";
import {
  answer,
  command,
  output,
  question,
  reasoning,
} from "../../../../../shared/fixtures.ts";
import type { Scenario } from "../data/pages.ts";
import { PromptDemo } from "../shared/preview-primitives.tsx";
import { previewStyles } from "../shared/preview-styles.ts";

const badge = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "3px 8px",
  borderRadius: "6px",
  border: `1px solid ${t.border}`,
  color: t.subtle,
  fontSize: "11px",
  whiteSpace: "nowrap",
});
const errorBox = css({
  border: `1px solid ${t.border}`,
  borderRadius: "12px",
  padding: "14px 16px",
  color: t.destructive,
  fontSize: "13px",
});

export function ChatPreview(handle: Handle<{ scenario: Scenario }>) {
  return () => {
    const { scenario } = handle.props;
    return (
      <>
        <div mix={previewStyles.chatHeader}>
          <div>
            <h2 mix={previewStyles.chatTitle}>New thread</h2>
            <p mix={previewStyles.chatDescription}>
              A small change. A thoughtful conversation.
            </p>
          </div>
          <span mix={badge}>Preview</span>
        </div>
        <MessageScroller id="chat-conversation" mix={previewStyles.chatBody}>
          {scenario === "empty" ? (
            <div
              mix={css({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "32px",
                textAlign: "center",
                gap: "12px",
              })}
            >
              <span
                mix={css({
                  display: "flex",
                  padding: "12px",
                  borderRadius: "16px",
                  background: t.muted,
                })}
              >
                <Icon name="message" size={22} />
              </span>
              <h3
                mix={css({
                  margin: "4px 0 0",
                  fontSize: "17px",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                })}
              >
                What should we build?
              </h3>
              <p
                mix={css({
                  margin: 0,
                  color: t.subtle,
                  fontSize: "13px",
                  maxWidth: "260px",
                })}
              >
                A place for questions, ideas, and the work in between.
              </p>
            </div>
          ) : (
            <MessageScrollerContent mix={previewStyles.chatContent}>
              <Message from="user">
                <MessageContent>
                  <MessageBubble>{question}</MessageBubble>
                </MessageContent>
              </Message>
              <Message>
                <MessageContent>
                  <Trace>
                    <Reasoning
                      key={`reasoning-${scenario}`}
                      status={scenario === "thinking" ? "thinking" : "complete"}
                      duration={5}
                      defaultOpen={scenario === "thinking"}
                    >
                      {reasoning}
                    </Reasoning>
                    {scenario !== "thinking" ? (
                      <Tool
                        key={`tool-${scenario}`}
                        name="Search the project"
                        status={scenario === "error" ? "error" : "success"}
                        defaultOpen={scenario === "error"}
                        input={JSON.stringify({ command }, null, 2)}
                        output={
                          scenario === "error"
                            ? "Permission denied. The workspace could not be read."
                            : output
                        }
                      />
                    ) : null}
                  </Trace>
                  {scenario === "complete" ? (
                    <>
                      <Markdown content={answer} />
                      <MessageActions>
                        <CodeBlockCopyButton
                          value={answer}
                          label="Copy response"
                        />
                        <span
                          mix={css({
                            fontSize: "11px",
                            marginLeft: "6px",
                            color: t.subtle,
                          })}
                        >
                          Remix assistant
                        </span>
                      </MessageActions>
                    </>
                  ) : scenario === "error" ? (
                    <div role="status" mix={errorBox}>
                      Something went wrong. Check access to the project and try
                      again.
                      <br />
                      <small>Example error state — no request was made.</small>
                    </div>
                  ) : null}
                </MessageContent>
              </Message>
            </MessageScrollerContent>
          )}
        </MessageScroller>
        <div mix={previewStyles.composer}>
          {scenario === "complete" ? (
            <div
              mix={css({
                display: "flex",
                justifyContent: "center",
                marginBottom: "12px",
              })}
            >
              <MessageScrollerButton targetId="chat-conversation" />
            </div>
          ) : null}
          <PromptDemo
            status={
              scenario === "thinking"
                ? "streaming"
                : scenario === "error"
                  ? "error"
                  : "ready"
            }
          />
          <p mix={previewStyles.note}>
            Visual preview only. Your message will not be sent.
          </p>
        </div>
      </>
    );
  };
}
