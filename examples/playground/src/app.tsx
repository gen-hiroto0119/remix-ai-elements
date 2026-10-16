import { css, type Handle, on, type RemixNode } from "remix/component";
import { CodeBlock, CodeBlockCopyButton } from "remix-ai-elements/code-block";
import { Markdown } from "remix-ai-elements/markdown";
import {
  Message,
  MessageActions,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageHeader,
} from "remix-ai-elements/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
} from "remix-ai-elements/message-scroller";
import {
  PromptInput,
  PromptInputAction,
  PromptInputStop,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  type PromptStatus,
} from "remix-ai-elements/prompt-input";
import { Reasoning } from "remix-ai-elements/reasoning";
import { darkTheme, lightTheme, tokens as t } from "remix-ai-elements/theme";
import { Tool } from "remix-ai-elements/tool";
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "remix-ai-elements/trace";
import { Icon } from "../../../packages/remix-ai-elements/src/internal/icon.js";
import { scrollbarStyle } from "../../../packages/remix-ai-elements/src/internal/parts.js";
import {
  answer,
  code,
  command,
  japanese,
  markdownSample,
  output,
  question,
  reasoning,
} from "../../shared/fixtures.js";

const items = [
  "Chat",
  "Message",
  "Prompt input",
  "Message scroller",
  "Trace",
  "Reasoning",
  "Tool",
  "Markdown",
  "Code block",
] as const;
type Page = (typeof items)[number];
type Scenario = "complete" | "empty" | "thinking" | "error";
const descriptions: Record<Page, string> = {
  Chat: "A conversation, composed from small Remix-native components.",
  Message: "A flexible layout for messages, content, avatars, and actions.",
  "Prompt input":
    "A quiet surface for a new thought. Ready, busy, and error states.",
  "Message scroller":
    "A contained conversation with a shortcut to the latest message.",
  Trace: "Small, readable steps for everything happening behind a response.",
  Reasoning:
    "Give the thought process a little space, without taking over the conversation.",
  Tool: "Make tool inputs, outputs, and their states easy to inspect.",
  Markdown:
    "Readable prose, lists, tables, and code. Raw HTML stays plain text.",
  "Code block":
    "A simple home for code, with copying, wrapping, and line numbers.",
};

const shell = css({
  minHeight: "100dvh",
  background: t.background,
  color: t.foreground,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: "14px",
  lineHeight: 1.5,
  "& *, & *::before, & *::after": { boxSizing: "border-box" },
  "& button, & select, & textarea": { fontFamily: "inherit" },
  "& a": { color: "inherit" },
});
const topbar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "20px 32px",
  borderBottom: `1px solid ${t.border}`,
  "@media (max-width: 760px)": { padding: "16px 20px" },
});
const brand = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  fontSize: "16px",
  textDecoration: "none",
});
const muted = css({ color: t.subtle });
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
const inline = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});
const quietButton = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  border: `1px solid ${t.border}`,
  borderRadius: "8px",
  padding: "7px 10px",
  background: t.background,
  color: t.foreground,
  font: "inherit",
  fontSize: "12px",
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": { background: t.muted },
  "&:focus-visible": { outline: `2px solid ${t.ring}`, outlineOffset: "3px" },
});
const layout = css({
  display: "grid",
  gridTemplateColumns: "196px minmax(0, 1fr)",
  maxWidth: "1280px",
  margin: "0 auto",
  "@media (max-width: 760px)": { display: "block" },
});
const sidebar = css({
  padding: "36px 20px 32px 28px",
  borderRight: `1px solid ${t.border}`,
  "@media (max-width: 760px)": {
    borderRight: 0,
    borderBottom: `1px solid ${t.border}`,
    padding: "12px 20px",
  },
});
const nav = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  "@media (max-width: 760px)": {
    flexDirection: "row",
    overflowX: "auto",
    padding: "2px 0 6px",
  },
});
const navButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",
  whiteSpace: "nowrap",
  width: "100%",
  padding: "8px 10px",
  background: "transparent",
  color: t.subtle,
  border: 0,
  borderRadius: "7px",
  font: "inherit",
  fontSize: "13px",
  textAlign: "left",
  cursor: "pointer",
  '&[aria-current="page"]': {
    background: t.muted,
    color: t.foreground,
    fontWeight: 500,
  },
  "&:hover": { color: t.foreground },
  "&:focus-visible": { outline: `2px solid ${t.ring}`, outlineOffset: "-2px" },
  "@media (max-width: 760px)": { width: "auto" },
});
const navLabel = css({
  margin: "0 10px 16px",
  fontSize: "11px",
  fontWeight: 500,
  color: t.subtle,
  "@media (max-width: 760px)": { display: "none" },
});
const main = css({
  minWidth: 0,
  padding: "42px 48px 32px",
  "@media (max-width: 1000px)": { padding: "32px 28px" },
  "@media (max-width: 760px)": { padding: "28px 20px" },
});
const heading = css({
  margin: "0 0 8px",
  fontSize: "32px",
  lineHeight: 1.2,
  fontWeight: 600,
  letterSpacing: "-0.045em",
});
const subtitle = css({
  margin: 0,
  color: t.subtle,
  fontSize: "14px",
  maxWidth: "580px",
});
const eyebrow = css({
  margin: "0 0 14px",
  fontSize: "10px",
  color: t.subtle,
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  fontWeight: 500,
});
const controls = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  margin: "28px 0 12px",
  fontSize: "12px",
  color: t.subtle,
});
const preview = css({
  overflow: "hidden",
  border: `1px solid ${t.border}`,
  borderRadius: "20px",
  minWidth: 0,
  background: t.background,
});
const sample = css({
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  padding: "32px",
  minWidth: 0,
  "@media (max-width: 600px)": { padding: "24px 16px" },
});
const sampleLabel = css({
  margin: "0 0 12px",
  fontSize: "11px",
  color: t.subtle,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
});
const footer = css({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
  fontSize: "11px",
  color: t.subtle,
  marginTop: "16px",
});
const chatHeader = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "24px 28px 16px",
});
const chatTitle = css({ margin: 0, fontSize: "14px", fontWeight: 500 });
const chatDescription = css({
  margin: "4px 0 0",
  fontSize: "12px",
  color: t.subtle,
});
const chatBody = css({
  height: "430px",
  "@media (max-width: 600px)": { height: "390px" },
});
const chatContent = css({
  padding: "20px 28px 32px",
  "@media (max-width: 600px)": { padding: "20px 16px 28px" },
});
const composer = css({
  padding: "12px 24px 20px",
  "@media (max-width: 600px)": { padding: "12px 16px 20px" },
});
const note = css({
  margin: "10px 0 0",
  textAlign: "center",
  color: t.subtle,
  fontSize: "10px",
});
const errorBox = css({
  border: `1px solid ${t.border}`,
  borderRadius: "12px",
  padding: "14px 16px",
  color: t.destructive,
  fontSize: "13px",
});
const sampleGroup = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

function PromptDemo(handle: Handle<{ status?: PromptStatus; label?: string }>) {
  return () => (
    <PromptInput
      status={handle.props.status}
      aria-label={handle.props.label || "Preview prompt"}
    >
      <PromptInputTextarea
        placeholder="Ask a follow-up…"
        aria-label={handle.props.label || "Your message"}
        aria-invalid={handle.props.status === "error" || undefined}
      />
      <PromptInputToolbar>
        <PromptInputAction disabled aria-label="Add attachment (preview only)">
          <Icon name="plus" />
        </PromptInputAction>
        <span>Remix assistant</span>
        <span mix={muted}>⌄</span>
        {handle.props.status === "streaming" ||
        handle.props.status === "submitted" ? (
          <PromptInputStop disabled title="Visual preview only" />
        ) : (
          <PromptInputSubmit disabled title="Visual preview only" />
        )}
      </PromptInputToolbar>
    </PromptInput>
  );
}

function ChatPreview(handle: Handle<{ scenario: Scenario }>) {
  return () => {
    const { scenario } = handle.props;
    return (
      <>
        <div mix={chatHeader}>
          <div>
            <h2 mix={chatTitle}>New thread</h2>
            <p mix={chatDescription}>
              A small change. A thoughtful conversation.
            </p>
          </div>
          <span mix={badge}>Preview</span>
        </div>
        <MessageScroller id="chat-conversation" mix={chatBody}>
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
            <MessageScrollerContent mix={chatContent}>
              <Message from="user">
                <MessageContent>
                  <MessageBubble>{question}</MessageBubble>
                </MessageContent>
              </Message>
              <Message>
                <MessageContent>
                  <Trace>
                    <Reasoning
                      key={scenario}
                      status={scenario === "thinking" ? "thinking" : "complete"}
                      duration={5}
                      defaultOpen={scenario === "thinking"}
                    >
                      {reasoning}
                    </Reasoning>
                    {scenario !== "thinking" ? (
                      <Tool
                        key={scenario}
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
        <div mix={composer}>
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
          <p mix={note}>Visual preview only. Your message will not be sent.</p>
        </div>
      </>
    );
  };
}

function Example(handle: Handle<{ label: string; children?: RemixNode }>) {
  return () => (
    <section>
      <h2 mix={sampleLabel}>{handle.props.label}</h2>
      {handle.props.children}
    </section>
  );
}

function ComponentPreview(handle: Handle<{ page: Page }>) {
  return () => {
    switch (handle.props.page) {
      case "Message":
        return (
          <div mix={sample}>
            <Example label="A conversation">
              <div mix={sampleGroup}>
                <Message from="user">
                  <MessageContent>
                    <MessageBubble>{question}</MessageBubble>
                  </MessageContent>
                </Message>
                <Message>
                  <MessageContent>
                    <MessageHeader>Remix assistant</MessageHeader>
                    <Markdown content="I’ll add **Light**, **Dark**, and **System** options, with an accessible toggle and a sensible default." />
                    <MessageActions>
                      <CodeBlockCopyButton
                        value="I’ll add Light, Dark, and System options."
                        label="Copy message"
                      />
                    </MessageActions>
                  </MessageContent>
                </Message>
              </div>
            </Example>
            <Example label="With an avatar">
              <Message>
                <MessageAvatar>R</MessageAvatar>
                <MessageContent>
                  <MessageBubble variant="outline">{japanese}</MessageBubble>
                </MessageContent>
              </Message>
            </Example>
            <Example label="Long content">
              <Message from="user">
                <MessageContent>
                  <MessageBubble>
                    Long identifiers stay inside the message:
                    remix_ai_elements_visual_preview_component_with_a_deliberately_long_identifier_to_check_wrapping
                  </MessageBubble>
                </MessageContent>
              </Message>
            </Example>
          </div>
        );
      case "Prompt input":
        return (
          <div mix={sample}>
            {(["ready", "submitted", "streaming", "error"] as const).map(
              (status) => (
                <Example key={status} label={status}>
                  <PromptDemo status={status} label={`${status} message`} />
                  {status === "error" ? (
                    <p
                      mix={css({
                        color: t.destructive,
                        fontSize: "12px",
                        margin: "8px 0 0",
                      })}
                    >
                      Unable to send. This is a visual example.
                    </p>
                  ) : null}
                </Example>
              ),
            )}
          </div>
        );
      case "Reasoning":
        return (
          <div mix={sample}>
            <Example label="Completed · collapsed">
              <Reasoning duration={5}>{reasoning}</Reasoning>
            </Example>
            <Example label="Completed · expanded">
              <Reasoning duration={5} defaultOpen>
                {reasoning}
              </Reasoning>
            </Example>
            <Example label="Thinking · static state">
              <Reasoning status="thinking" defaultOpen>
                {reasoning}
              </Reasoning>
            </Example>
          </div>
        );
      case "Tool":
        return (
          <div mix={sample}>
            {(["pending", "running", "success", "error"] as const).map(
              (status) => (
                <Example key={status} label={status}>
                  <Tool
                    name={
                      status === "success"
                        ? "Read appearance settings"
                        : "Search the project"
                    }
                    status={status}
                    defaultOpen={status === "success" || status === "error"}
                    input={JSON.stringify({ command }, null, 2)}
                    output={
                      status === "error"
                        ? "Permission denied. Check workspace access."
                        : status === "success"
                          ? output
                          : undefined
                    }
                  />
                </Example>
              ),
            )}
          </div>
        );
      case "Trace":
        return (
          <div mix={sample}>
            <Example label="A few small steps">
              <Trace>
                <TraceLine status="success">
                  <TraceIcon>
                    <Icon name="check" />
                  </TraceIcon>
                  <TraceTitle>Read the request</TraceTitle>
                  <TraceDescription>0.2s</TraceDescription>
                </TraceLine>
                <Reasoning duration={5}>{reasoning}</Reasoning>
                <Tool
                  name="Search the project"
                  input={JSON.stringify({ command }, null, 2)}
                  output={output}
                />
                <TraceLine status="running">
                  <TraceIcon>
                    <Icon name="clock" />
                  </TraceIcon>
                  <TraceTitle>Preparing a response…</TraceTitle>
                </TraceLine>
                <TraceLine status="pending">
                  <TraceIcon>
                    <Icon name="code" />
                  </TraceIcon>
                  <TraceTitle>Review the changes · Pending</TraceTitle>
                </TraceLine>
              </Trace>
            </Example>
          </div>
        );
      case "Markdown":
        return (
          <div mix={sample}>
            <Markdown content={markdownSample} />
            <Example label="Japanese text">
              <Markdown content={japanese} />
            </Example>
          </div>
        );
      case "Code block":
        return (
          <div mix={sample}>
            <Example label="With a filename">
              <CodeBlock code={code} language="tsx" filename="appearance.tsx" />
            </Example>
            <Example label="Line numbers">
              <CodeBlock
                code={
                  'const theme = darkTheme;\nconst message = "Hello, Remix.";\n\n// Small, composable pieces.'
                }
                language="ts"
                lineNumbers
              />
            </Example>
            <Example label="Wrapped output">
              <CodeBlock
                code={
                  "GET /api/example?conversation=remix-ai-elements-visual-preview-with-a-deliberately-long-query-string-to-demonstrate-wrapping-without-horizontal-page-overflow"
                }
                wrap
              />
            </Example>
          </div>
        );
      case "Message scroller":
        return (
          <>
            <div mix={chatHeader}>
              <div>
                <h2 mix={chatTitle}>A longer conversation</h2>
                <p mix={chatDescription}>
                  Scroll freely, or jump to the latest message.
                </p>
              </div>
              <MessageScrollerButton targetId="scroll-demo" />
            </div>
            <MessageScroller id="scroll-demo" mix={css({ height: "420px" })}>
              <MessageScrollerContent>
                {Array.from({ length: 12 }, (_, index) => (
                  <Message
                    key={index}
                    from={index % 2 === 0 ? "user" : "assistant"}
                  >
                    <MessageContent>
                      {index % 2 === 0 ? (
                        <MessageBubble>
                          Message {index + 1} — {question}
                        </MessageBubble>
                      ) : (
                        <>
                          <MessageHeader>
                            Remix assistant · {index + 1}
                          </MessageHeader>
                          <Markdown content={japanese} />
                        </>
                      )}
                    </MessageContent>
                  </Message>
                ))}
              </MessageScrollerContent>
            </MessageScroller>
          </>
        );
      default:
        return null;
    }
  };
}

export function App(handle: Handle) {
  let page: Page = "Chat";
  let dark = false;
  let scenario: Scenario = "complete";
  return () => (
    <div mix={[dark ? darkTheme : lightTheme, shell]}>
      <header mix={topbar}>
        <a href="#" mix={brand}>
          <Icon name="code" size={20} />
          <span>
            remix <span mix={muted}>/</span> ai elements
          </span>
        </a>
        <div mix={inline}>
          <span mix={badge}>Remix 3</span>
          <button
            type="button"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Switch to light theme" : "Switch to dark theme"}
            mix={[
              quietButton,
              on("click", () => {
                dark = !dark;
                void handle.update();
              }),
            ]}
          >
            <Icon name={dark ? "sun" : "moon"} />
          </button>
        </div>
      </header>
      <div mix={layout}>
        <aside mix={sidebar}>
          <p mix={navLabel}>Playground</p>
          <nav aria-label="Components" mix={[nav, scrollbarStyle]}>
            {items.map((item) => (
              <button
                key={item}
                type="button"
                aria-current={page === item ? "page" : undefined}
                mix={[
                  navButton,
                  on("click", () => {
                    page = item;
                    void handle.update();
                  }),
                ]}
              >
                {item}
                {item === "Chat" ? <Icon name="message" size={13} /> : null}
              </button>
            ))}
          </nav>
        </aside>
        <main mix={main}>
          <p mix={eyebrow}>Remix-native components</p>
          <h1 mix={heading}>{page}</h1>
          <p mix={subtitle}>{descriptions[page]}</p>
          <div mix={controls}>
            <span mix={inline}>
              <span>Preview</span>
              <span mix={badge}>{dark ? "Dark" : "Light"}</span>
            </span>
            <div mix={inline}>
              {page === "Chat" ? (
                <label>
                  State{" "}
                  <select
                    aria-label="Conversation state"
                    mix={[
                      quietButton,
                      on("change", (event) => {
                        scenario = event.currentTarget.value as Scenario;
                        void handle.update();
                      }),
                    ]}
                  >
                    <option value="complete" selected={scenario === "complete"}>
                      Completed
                    </option>
                    <option value="empty" selected={scenario === "empty"}>
                      Empty
                    </option>
                    <option value="thinking" selected={scenario === "thinking"}>
                      Thinking
                    </option>
                    <option value="error" selected={scenario === "error"}>
                      Error
                    </option>
                  </select>
                </label>
              ) : null}
              <button
                type="button"
                mix={[
                  quietButton,
                  on("click", () => {
                    const url = new URL(window.location.href);
                    url.port = "5174";
                    url.hash = "";
                    window.open(url, "_blank", "noopener,noreferrer");
                  }),
                ]}
              >
                shadcn reference ↗
              </button>
            </div>
          </div>
          <div mix={preview}>
            {page === "Chat" ? (
              <ChatPreview scenario={scenario} />
            ) : (
              <ComponentPreview key={page} page={page} />
            )}
          </div>
          <div mix={footer}>
            <span>Built with remix/component · css() / mix</span>
            <span>Static fixtures · No AI connection</span>
          </div>
        </main>
      </div>
    </div>
  );
}
