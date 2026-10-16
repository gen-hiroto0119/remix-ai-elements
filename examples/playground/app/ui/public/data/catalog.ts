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
