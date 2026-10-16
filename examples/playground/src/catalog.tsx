import { css, type Handle, on } from "remix/component";
import {
  ChainOfThought,
  type ChainOfThoughtStep,
} from "remix-ai-elements/chain-of-thought";
import { Checkpoint } from "remix-ai-elements/checkpoint";
import { CodeBlock } from "remix-ai-elements/code-block";
import { Confirmation } from "remix-ai-elements/confirmation";
import { Context } from "remix-ai-elements/context";
import { type FileNode, FileTree } from "remix-ai-elements/file-tree";
import { InlineCitation } from "remix-ai-elements/inline-citation";
import { ModelSelector } from "remix-ai-elements/model-selector";
import { Plan } from "remix-ai-elements/plan";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "remix-ai-elements/prompt-input";
import { Queue } from "remix-ai-elements/queue";
import { type Source, Sources } from "remix-ai-elements/sources";
import { StackTrace } from "remix-ai-elements/stack-trace";
import { Subagent } from "remix-ai-elements/subagent";
import { Suggestion, Suggestions } from "remix-ai-elements/suggestion";
import { Task } from "remix-ai-elements/task";
import { Terminal } from "remix-ai-elements/terminal";
import { TestResults } from "remix-ai-elements/test-results";
import { tokens as t } from "remix-ai-elements/theme";
import {
  ActionButton,
  focusRing,
} from "../../../packages/remix-ai-elements/src/internal/parts.js";

export const catalogDescriptions = {
  "Chain of Thought":
    "Follow a sequence of research steps, with expandable evidence.",
  Checkpoint: "A quiet marker in a conversation, with a restore action.",
  Confirmation:
    "Ask for permission before an action, separate from the activity trace.",
  Context:
    "Inspect context-window usage and the input, output, and reasoning breakdown.",
  "File Tree":
    "Browse nested folders and select a file without leaving the conversation.",
  "Inline Citation":
    "Keep references close to the text, with a compact source preview.",
  "Model Selector":
    "Choose a model by provider, with native keyboard-accessible radio controls.",
  Plan: "A proposed sequence of work, with completed, active, and pending steps.",
  Queue:
    "Keep upcoming work and completed tasks in separate, collapsible groups.",
  Sources: "A compact list of the references behind an answer.",
  "Stack Trace":
    "Inspect an error and its application frames, without framework noise.",
  Subagent: "A nested activity trace and a report from a delegated task.",
  Suggestion:
    "A few useful starting points that fill the composer without sending.",
  Task: "A focused unit of work, with a short sequence of progress steps.",
  Terminal:
    "Command output and exit states, presented as activity rather than a live shell.",
  "Test Results":
    "Suite summaries, individual results, and expandable failure output.",
} as const;
export type CatalogPage = keyof typeof catalogDescriptions;
export function isCatalogPage(page: string): page is CatalogPage {
  return Object.hasOwn(catalogDescriptions, page);
}
export const officialPatterns = [
  "Chain of Thought",
  "Chat",
  "Checkpoint",
  "Confirmation",
  "Context",
  "File Tree",
  "Inline Citation",
  "Message",
  "Model Selector",
  "Plan",
  "Prompt input",
  "Queue",
  "Reasoning",
  "Sources",
  "Stack Trace",
  "Subagent",
  "Suggestion",
  "Task",
  "Terminal",
  "Test Results",
  "Tool",
] as const;
export function officialUrl(page: string) {
  return `https://ui.shadcn.com/docs/ai-elements/${page.toLowerCase().replaceAll(" ", "-")}`;
}

const column = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
  maxWidth: "580px",
  margin: "0 auto",
  padding: "32px 24px",
  minWidth: 0,
  "@media (max-width: 600px)": { padding: "24px 16px" },
});
const muted = css({ color: t.subtle, fontSize: "12px", margin: 0 });
const toolbar = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  paddingBottom: "16px",
  borderBottom: `1px solid ${t.border}`,
});
const selectStyle = css({
  padding: "6px 10px",
  border: `1px solid ${t.border}`,
  background: t.background,
  color: t.foreground,
  borderRadius: "8px",
  font: "inherit",
  fontSize: "12px",
  maxWidth: "100%",
});
const sources: Source[] = [
  {
    id: "remix",
    title: "Remix — Rendering UI",
    url: "https://remix.run",
    description:
      "Components, native events, and styles built for the web platform.",
  },
  {
    id: "mdn",
    title: "MDN — Server-sent events",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
    description: "Receiving events from a server over an HTTP connection.",
  },
];
const files: FileNode[] = [
  {
    type: "folder",
    name: "app",
    path: "app",
    children: [
      { type: "file", name: "router.ts", path: "app/router.ts" },
      { type: "file", name: "routes.ts", path: "app/routes.ts" },
    ],
  },
  {
    type: "folder",
    name: "components",
    path: "components",
    children: [
      {
        type: "folder",
        name: "ui",
        path: "components/ui",
        children: [
          {
            type: "file",
            name: "button.tsx",
            path: "components/ui/button.tsx",
          },
        ],
      },
      { type: "file", name: "chat.tsx", path: "components/chat.tsx" },
    ],
  },
];
type State = "complete" | "running" | "error" | "empty";
const states: State[] = ["complete", "running", "error", "empty"];
const progressPages: string[] = [
  "Chain of Thought",
  "Plan",
  "Queue",
  "Task",
  "Subagent",
  "Terminal",
  "Test Results",
];

export function Introduction(
  handle: Handle<{
    navigate: (page: (typeof officialPatterns)[number]) => void;
  }>,
) {
  return () => (
    <div mix={column}>
      <h2 mix={css({ margin: 0, fontSize: "18px" })}>
        AI Elements · 21 patterns
      </h2>
      <p mix={muted}>
        All 21 patterns from the official AI Elements navigation, implemented
        with Remix. These are visual examples, not an AI service.
      </p>
      <div
        mix={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "8px",
        })}
      >
        {officialPatterns.map((page) => (
          <ActionButton
            key={page}
            mix={[
              css({
                justifyContent: "space-between",
                borderColor: t.border,
                padding: "12px",
                color: t.foreground,
              }),
              on("click", () => handle.props.navigate(page)),
            ]}
          >
            {page}
            <span aria-hidden="true">↗</span>
          </ActionButton>
        ))}
      </div>
      <p mix={muted}>
        Supporting primitives: Message scroller, Trace, Markdown, and Code
        block. AI transport, execution, and npm publishing remain separate work.
      </p>
    </div>
  );
}

export function CatalogPreview(handle: Handle<{ page: CatalogPage }>) {
  let state: State = "complete";
  let decision: "pending" | "approved" | "denied" = "pending";
  let restored = false;
  let selectedFile = "components/ui/button.tsx";
  let prompt = "";
  const update = () => {
    void handle.update();
  };
  return () => {
    const page = handle.props.page;
    const status =
      state === "running" ? "running" : state === "error" ? "error" : "success";
    const steps: ChainOfThoughtStep[] =
      state === "empty"
        ? []
        : [
            { id: "tokens", title: "Add theme tokens", status: "success" },
            {
              id: "toggle",
              title: "Build the appearance toggle",
              status: state === "complete" ? "success" : status,
              content:
                state === "error" ? (
                  <CodeBlock
                    code="Unable to update the appearance settings. Check access and try again."
                    language="text"
                    wrap
                  />
                ) : undefined,
            },
            {
              id: "verify",
              title: "Verify keyboard navigation and contrast",
              status: state === "complete" ? "success" : "pending",
            },
          ];
    const body = () => {
      switch (page) {
        case "Chain of Thought":
          return (
            <ChainOfThought
              key={state}
              steps={steps.map((step, i) => ({
                ...step,
                title:
                  [
                    "Read the build log",
                    "Search the documentation",
                    "Inspect the image cache",
                  ][i] ?? step.title,
                content:
                  step.content ??
                  (i === 0 ? (
                    <CodeBlock
                      code={"install    41s\ncompile    38s\nimages     3m 52s"}
                      language="text"
                    />
                  ) : i === 1 ? (
                    <Sources sources={sources} defaultOpen />
                  ) : (
                    <CodeBlock
                      code={"const cacheKey = process.env.COMMIT_SHA"}
                      language="ts"
                    />
                  )),
              }))}
              status={status}
              defaultOpen
              title={
                state === "running"
                  ? "Researching"
                  : state === "empty"
                    ? "No research steps yet"
                    : state === "error"
                      ? "Research stopped · 1 failed step"
                      : "Researched in 3 steps"
              }
            />
          );
        case "Checkpoint":
          return (
            <>
              <p>Renamed Button to Action in the component library.</p>
              <Checkpoint
                label="Button renamed"
                disabled={restored}
                onRestore={() => {
                  restored = true;
                  update();
                }}
              />
              {restored ? (
                <p role="status">
                  Preview restored to “Button renamed”. No project files were
                  changed.
                </p>
              ) : (
                <p>Updated the documentation to match the new name.</p>
              )}
              <ActionButton
                mix={on("click", () => {
                  restored = false;
                  update();
                })}
              >
                Reset preview
              </ActionButton>
            </>
          );
        case "Confirmation":
          return (
            <>
              <Confirmation
                title="Remove the build output?"
                description="This action would remove the dist folder. This preview never executes commands."
                state={decision}
                onDecision={(approved) => {
                  decision = approved ? "approved" : "denied";
                  update();
                }}
              />
              <ActionButton
                mix={on("click", () => {
                  decision = "pending";
                  update();
                })}
              >
                Reset preview
              </ActionButton>
            </>
          );
        case "Context":
          return (
            <>
              <p mix={muted}>
                Hover, click, or focus and press Enter to inspect usage.
              </p>
              <div>
                <Context
                  input={8420}
                  output={1260}
                  reasoning={980}
                  limit={128000}
                />
              </div>
              <div>
                <Context
                  input={119000}
                  output={7000}
                  reasoning={1000}
                  limit={128000}
                />
              </div>
              <div>
                <Context input={0} output={0} limit={0} />
              </div>
            </>
          );
        case "File Tree":
          return (
            <>
              <FileTree
                nodes={files}
                value={selectedFile}
                onSelect={(path) => {
                  selectedFile = path;
                  update();
                }}
              />
              <p role="status" mix={[muted, css({ overflowWrap: "anywhere" })]}>
                Selected: {selectedFile}
              </p>
            </>
          );
        case "Inline Citation":
          return (
            <>
              <p>
                Remix builds UI from components and native browser events.{" "}
                <InlineCitation source={sources[0]!} />
              </p>
              <p>
                The AI transport can deliver incremental events over HTTP.{" "}
                <InlineCitation source={sources[1]!} />
              </p>
              <p mix={muted}>
                Source cards are available on hover, click, and keyboard. Links
                open in a new tab.
              </p>
            </>
          );
        case "Model Selector":
          return (
            <PromptInput>
              <PromptInputTextarea
                aria-label="Model preview message"
                placeholder="Ask the agent to change your code…"
              />
              <PromptInputToolbar>
                <ModelSelector
                  defaultValue="gpt-5"
                  models={[
                    { id: "gpt-5", name: "GPT-5", provider: "OpenAI" },
                    {
                      id: "gpt-5-mini",
                      name: "GPT-5 mini",
                      provider: "OpenAI",
                    },
                    {
                      id: "sonnet",
                      name: "Claude Sonnet 4.5",
                      provider: "Anthropic",
                    },
                    {
                      id: "haiku",
                      name: "Claude Haiku 4.5",
                      provider: "Anthropic",
                    },
                  ]}
                />
                <ModelSelector
                  label="Effort"
                  defaultValue="medium"
                  models={["low", "medium", "high"].map((id) => ({
                    id,
                    name: id[0]!.toUpperCase() + id.slice(1),
                    provider: "Reasoning effort",
                  }))}
                />
                <PromptInputSubmit disabled title="Visual preview only" />
              </PromptInputToolbar>
            </PromptInput>
          );
        case "Plan":
          return (
            <Plan
              key={state}
              title="Plan: add an appearance setting"
              steps={steps}
              status={status}
            />
          );
        case "Queue":
          return <Queue items={steps} />;
        case "Sources":
          return (
            <>
              <Sources sources={sources} defaultOpen />
              <Sources sources={[]} title="No sources attached" />
            </>
          );
        case "Stack Trace":
          return (
            <StackTrace
              stack={
                "TypeError: Cannot read properties of undefined (reading 'theme')\n    at resolveTheme (app/settings.ts:42:12)\n    at renderSettings (app/routes/settings.ts:18:5)\n    at processRequest (node_modules/remix/server.js:91:3)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
              }
            />
          );
        case "Subagent":
          return (
            <Subagent
              key={state}
              title={
                state === "running"
                  ? "Running the research subagent"
                  : state === "empty"
                    ? "No delegated work yet"
                    : "Research subagent"
              }
              status={status}
              defaultOpen
              report={
                state === "complete"
                  ? "The cache key includes the commit SHA. Key the cache on the image directory instead."
                  : undefined
              }
            >
              {state !== "empty" ? (
                <>
                  <Terminal
                    command="rg cacheKey scripts"
                    output="scripts/optimize-images.ts:14: const cacheKey = process.env.COMMIT_SHA"
                  />
                  <Task
                    title="Inspect the cache"
                    steps={steps}
                    status={status}
                    defaultOpen
                  />
                </>
              ) : null}
            </Subagent>
          );
        case "Suggestion":
          return (
            <>
              <Suggestions>
                {[
                  "Add a dark mode toggle",
                  "Fix the failing build",
                  "Write tests for the form",
                  "Add a loading state",
                  "日本語で説明してください",
                ].map((text) => (
                  <Suggestion
                    key={text}
                    prompt={text}
                    onSelect={(text) => {
                      prompt = text;
                      update();
                    }}
                  />
                ))}
              </Suggestions>
              <PromptInput>
                <PromptInputTextarea
                  aria-label="Suggested prompt"
                  placeholder="Choose a suggestion…"
                  value={prompt}
                  mix={on("input", (event) => {
                    prompt = event.currentTarget.value;
                  })}
                />
                <PromptInputToolbar>
                  <span>Preview only</span>
                  <PromptInputSubmit disabled />
                </PromptInputToolbar>
              </PromptInput>
            </>
          );
        case "Task":
          return (
            <Task
              key={state}
              title={
                state === "complete"
                  ? "Added appearance settings"
                  : state === "empty"
                    ? "No task steps yet"
                    : "Update appearance settings"
              }
              status={status}
              steps={steps}
              defaultOpen
            />
          );
        case "Terminal":
          return (
            <Terminal
              key={state}
              command="pnpm build"
              status={status}
              exitCode={
                state === "error" ? 1 : state === "complete" ? 0 : undefined
              }
              output={
                state === "empty"
                  ? "No output yet."
                  : state === "error"
                    ? "error TS2307: Cannot find module './theme'.\nBuild failed with exit code 1."
                    : state === "running"
                      ? "Building production bundle…\nTransforming modules…"
                      : "✓ 42 modules transformed.\ndist/index.js  18.4 kB\nBuild completed in 1.2s."
              }
              defaultOpen
            />
          );
        case "Test Results":
          return (
            <TestResults
              key={state}
              status={state === "running" ? "running" : "complete"}
              command="pnpm test"
              suites={
                state === "empty"
                  ? []
                  : [
                      {
                        id: "theme",
                        name: "theme.test.ts",
                        tests: [
                          {
                            id: "light",
                            name: "renders the light theme",
                            status: "passed",
                            duration: "2ms",
                          },
                          {
                            id: "dark",
                            name: "renders the dark theme",
                            status: state === "error" ? "failed" : "passed",
                            duration: "4ms",
                            error:
                              "Expected background: #171717\nReceived background: #ffffff",
                          },
                          {
                            id: "system",
                            name: "follows the OS preference",
                            status: "skipped",
                          },
                        ],
                      },
                    ]
              }
            />
          );
      }
    };
    return (
      <div mix={column}>
        {progressPages.includes(page) ? (
          <div mix={toolbar}>
            <label>
              State{" "}
              <select
                aria-label="Example state"
                mix={[
                  selectStyle,
                  focusRing,
                  on("change", (event) => {
                    state = event.currentTarget.value as State;
                    update();
                  }),
                ]}
              >
                {states.map((value) => (
                  <option key={value} value={value} selected={state === value}>
                    {value[0]!.toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <span mix={muted}>Fixed data · not live execution</span>
          </div>
        ) : null}
        {body()}
        <p mix={muted}>
          Visual preview only. Actions update local examples, not your project
          or an AI service.
        </p>
      </div>
    );
  };
}
