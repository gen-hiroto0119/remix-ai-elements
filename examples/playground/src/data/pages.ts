import { catalogDescriptions, officialPatterns } from "./catalog.js";

export const items = [
  "Introduction",
  ...officialPatterns,
  "Message scroller",
  "Trace",
  "Markdown",
  "Code block",
] as const;

export type Page = (typeof items)[number];
export type Scenario = "complete" | "empty" | "thinking" | "error";

export const descriptions: Record<Page, string> = {
  ...catalogDescriptions,
  Introduction:
    "The complete AI Elements pattern catalog, with Remix-native building blocks.",
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
