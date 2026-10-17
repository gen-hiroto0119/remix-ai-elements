# AI Elements visual coverage

Reference: [shadcn/ui](https://github.com/shadcn-ui/ui/tree/c2477f311c19982ef6e246085438e6cfec3e35ea/apps/v4/examples/base), commit `c2477f311c19982ef6e246085438e6cfec3e35ea`.
The 21 patterns below match the official navigation supplied in the task. Introduction is documentation, not a component. Four supporting previews (Message scroller, Trace, Markdown, Code block) remain available separately.

| Official pattern | Public entrypoint / composition | Reference example |
| --- | --- | --- |
| Chain of Thought | `/chain-of-thought` | `chain-of-thought-demo.tsx` |
| Chat | Message + MessageScroller + PromptInput + Trace | `chat-demo.tsx` |
| Checkpoint | `/checkpoint` | `checkpoint-demo.tsx` |
| Confirmation | `/confirmation` | `confirmation-demo.tsx` |
| Context | `/context` | `context-demo.tsx` |
| File Tree | `/file-tree` | `file-tree-demo.tsx` |
| Inline Citation | `/inline-citation` | `inline-citation-demo.tsx` |
| Message | `/message` | existing Base Rhea snapshot |
| Model Selector | `/model-selector` | `model-selector-demo.tsx` |
| Plan | `/plan` | `plan-demo.tsx` |
| Prompt Input | `/prompt-input` | `prompt-input-demo.tsx` |
| Queue | `/queue` | `queue-demo.tsx` |
| Reasoning | `/reasoning` | `reasoning-demo.tsx` |
| Sources | `/sources` | `sources-demo.tsx` |
| Stack Trace | `/stack-trace` | `stack-trace-demo.tsx` |
| Subagent | `/subagent` | `subagent-demo.tsx` |
| Suggestion | `/suggestion` | `suggestion-demo.tsx` |
| Task | `/task` | `task-demo.tsx` |
| Terminal | `/terminal` | `terminal-demo.tsx` |
| Test Results | `/test-results` | `test-results-demo.tsx` |
| Tool | `/tool` | `tool-basic.tsx` |

## Deliberate boundaries

- These are Remix-native visual ports of the patterns, not React API compatibility wrappers or a claim of pixel identity across platforms. `css()` / `mix`, native details, buttons, radio inputs, and the HTML Popover API replace the React primitives. Modern browsers with Popover API support are required for the source/context/model cards.
- Context and citations support hover, click, and keyboard activation. Model selection uses provider-grouped native radios, rather than a React dropdown menu; arrow-key selection stays open until Escape or dismissal.
- File Tree uses nested disclosure lists and file buttons, not an ARIA tree widget with custom roving focus. Stack Trace displays raw frames; it does not invent editor links or source maps.
- Checkpoint and Confirmation expose callbacks; they never restore files or run commands. Suggestions populate a preview composer without sending. Terminal, Subagent, Plan, Queue, and Test Results accept fixed data; there is no process, agent, or test runner behind them.
- This visual-coverage report excludes the separate AI SDK transport and streaming demo. Authentication, npm publication, and merge are also outside its scope; the 21 fixed visual examples do not demonstrate AI execution.
- The isolated React reference app still covers the original Chat subset. The added patterns link to their official documentation, rather than pretending the React Chat page is a comparison for every pattern.

## Public data shapes

Use stable, unique IDs for steps, sources, suites, and tests. File paths identify File Tree nodes. Activity statuses are `pending | running | success | error`; test statuses are `passed | failed | skipped`. Error text and command output are rendered as text, never HTML. Source URLs allow only absolute HTTP(S) URLs.
