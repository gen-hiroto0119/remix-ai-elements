import {
  ArrowDown,
  ArrowUp,
  Check,
  Code,
  MessageSquare,
  Moon,
  Plus,
  Square,
  Sun,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
} from "@/components/ui/code-block";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Message, MessageContent } from "@/components/ui/message";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import {
  code,
  command,
  output,
  question,
  reasoning,
} from "../../shared/fixtures";

type State = "complete" | "empty" | "thinking" | "error";

function ReferenceCode({
  value,
  language = "text",
}: {
  value: string;
  language?: string;
}) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <span className="text-xs">{language}</span>
        <CodeBlockActions>
          <CodeBlockCopyButton value={value} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent className="text-[13px] leading-[1.7]">
        {value}
      </CodeBlockContent>
    </CodeBlock>
  );
}

function Conversation({ state }: { state: State }) {
  return (
    <div className="overflow-hidden rounded-[20px] border bg-background">
      <div className="flex items-center justify-between gap-4 px-7 pt-6 pb-4">
        <div>
          <h2 className="text-sm font-medium">New thread</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            A small change. A thoughtful conversation.
          </p>
        </div>
        <span className="rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground">
          Preview
        </span>
      </div>
      <section
        id="reference-conversation"
        aria-label="Reference conversation"
        tabIndex={0}
        className="h-[430px] overflow-y-auto overscroll-contain max-sm:h-[390px]"
      >
        {state === "empty" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="rounded-2xl bg-muted p-3">
              <MessageSquare className="size-[22px]" />
            </span>
            <h3 className="mt-1 text-[17px] font-medium tracking-tight">
              What should we build?
            </h3>
            <p className="max-w-[260px] text-[13px] text-muted-foreground">
              A place for questions, ideas, and the work in between.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 px-7 pt-5 pb-8 max-sm:px-4">
            <Message align="end">
              <MessageContent>
                <Bubble align="end" variant="muted">
                  <BubbleContent>{question}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <Message>
              <MessageContent>
                <Trace>
                  <TraceCollapsible defaultOpen={state === "thinking"}>
                    <TraceCollapsibleTrigger>
                      <TraceLine
                        status={state === "thinking" ? "running" : undefined}
                      >
                        <TraceTitle>
                          {state === "thinking"
                            ? "Thinking…"
                            : "Thought for 5s"}
                        </TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      {reasoning}
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                  {state !== "thinking" ? (
                    <TraceCollapsible defaultOpen={state === "error"}>
                      <TraceCollapsibleTrigger>
                        <TraceLine
                          status={state === "error" ? "error" : undefined}
                        >
                          <TraceIcon>
                            {state === "error" ? (
                              <TriangleAlert />
                            ) : (
                              <Terminal />
                            )}
                          </TraceIcon>
                          <TraceTitle>Search the project</TraceTitle>
                          <TraceDescription className="text-xs">
                            {state === "error" ? "Failed" : "Completed"}
                          </TraceDescription>
                        </TraceLine>
                      </TraceCollapsibleTrigger>
                      <TraceCollapsibleContent>
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="mb-1.5 text-xs font-medium">Input</p>
                            <ReferenceCode
                              value={JSON.stringify({ command }, null, 2)}
                              language="json"
                            />
                          </div>
                          <div>
                            <p className="mb-1.5 text-xs font-medium">
                              {state === "error" ? "Error" : "Output"}
                            </p>
                            <ReferenceCode
                              value={
                                state === "error"
                                  ? "Permission denied. The workspace could not be read."
                                  : output
                              }
                            />
                          </div>
                        </div>
                      </TraceCollapsibleContent>
                    </TraceCollapsible>
                  ) : null}
                </Trace>
                {state === "complete" ? (
                  <div className="reference-prose text-sm leading-7">
                    <p>
                      The appearance settings now have a <strong>Light</strong>,{" "}
                      <strong>Dark</strong>, and <strong>System</strong> option.
                      New visitors follow their OS preference.
                    </p>
                    <h3>What changed</h3>
                    <ul>
                      <li>Added a small, keyboard-accessible theme toggle.</li>
                      <li>Kept the theme scoped to the conversation.</li>
                      <li>
                        Used Remix’s native <code>css()</code> and{" "}
                        <code>mix</code> — no Tailwind required.
                      </li>
                    </ul>
                    <ReferenceCode value={code} language="tsx" />
                    <p>
                      The same components work in both themes, without changing
                      the markup.
                    </p>
                  </div>
                ) : state === "error" ? (
                  <div className="rounded-xl border p-4 text-[13px] text-destructive">
                    Something went wrong. Check access to the project and try
                    again.
                    <br />
                    <small>Example error state — no request was made.</small>
                  </div>
                ) : null}
              </MessageContent>
            </Message>
          </div>
        )}
      </section>
      <div className="px-6 pt-3 pb-5 max-sm:px-4">
        {state === "complete" ? (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              aria-label="Scroll to latest message"
              className="flex size-8 items-center justify-center rounded-full border"
              onClick={() => {
                const el = document.getElementById("reference-conversation");
                if (el) el.scrollTop = el.scrollHeight;
              }}
            >
              <ArrowDown className="size-4" />
            </button>
          </div>
        ) : null}
        <form onSubmit={(event) => event.preventDefault()}>
          <InputGroup>
            <InputGroupTextarea
              aria-label="Your message"
              placeholder="Ask a follow-up…"
              aria-invalid={state === "error" || undefined}
              className="min-h-[76px] max-h-[240px] overflow-y-auto px-3.5 py-3 [scrollbar-width:thin]"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                disabled
                aria-label="Add attachment (preview only)"
                size="icon-sm"
              >
                <Plus />
              </InputGroupButton>
              <span className="text-xs font-normal">Remix assistant</span>
              <span className="text-xs">⌄</span>
              <InputGroupButton
                disabled
                aria-label={
                  state === "thinking"
                    ? "Stop generation (preview only)"
                    : "Send message (preview only)"
                }
                variant="default"
                size="icon-sm"
                className="ml-auto rounded-full"
              >
                {state === "thinking" ? <Square /> : <ArrowUp />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
        <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
          Visual preview only. Your message will not be sent.
        </p>
      </div>
    </div>
  );
}

export function App() {
  const [dark, setDark] = useState(false);
  const [state, setState] = useState<State>("complete");
  return (
    <div
      className={
        dark
          ? "dark min-h-dvh bg-background text-foreground"
          : "min-h-dvh bg-background text-foreground"
      }
    >
      <header className="flex items-center justify-between gap-4 border-b px-8 py-5 max-md:px-5">
        <div className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <Code className="size-5" />
          <span>
            shadcn <span className="text-muted-foreground">/</span> reference
          </span>
        </div>
        <button
          type="button"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          className="rounded-lg border p-2"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </header>
      <div className="mx-auto grid max-w-[1280px] grid-cols-[196px_minmax(0,1fr)] max-md:block">
        <aside className="border-r px-7 py-9 max-md:hidden">
          <p className="mb-4 text-[11px] text-muted-foreground">Reference</p>
          <div className="rounded-lg bg-muted px-2.5 py-2 text-[13px] font-medium">
            Chat
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Official Base Rhea components. React + Tailwind, development only.
          </p>
        </aside>
        <main className="min-w-0 px-12 pt-[42px] pb-8 max-lg:px-7 max-md:px-5 max-md:pt-7">
          <p className="mb-3.5 text-[10px] font-medium tracking-[0.13em] text-muted-foreground uppercase">
            Upstream reference
          </p>
          <h1 className="mb-2 text-[32px] leading-[1.2] font-semibold tracking-[-0.045em]">
            Chat
          </h1>
          <p className="text-sm text-muted-foreground">
            The same fixtures, rendered with the official shadcn components.
          </p>
          <div className="mt-7 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Base Rhea · {dark ? "Dark" : "Light"}</span>
            <label>
              State{" "}
              <select
                aria-label="Conversation state"
                value={state}
                onChange={(event) => setState(event.target.value as State)}
                className="rounded-lg border bg-background px-2.5 py-2 text-foreground"
              >
                <option value="complete">Completed</option>
                <option value="empty">Empty</option>
                <option value="thinking">Thinking</option>
                <option value="error">Error</option>
              </select>
            </label>
          </div>
          <Conversation key={state} state={state} />
          <footer className="mt-4 flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground">
            <a
              href="https://ui.shadcn.com/docs/ai-elements/base/chat"
              target="_blank"
              rel="noreferrer"
            >
              Official patterns ↗
            </a>
            <span className="flex items-center gap-1">
              <Check className="size-3" /> Isolated from the Remix package
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
