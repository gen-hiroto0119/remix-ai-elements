import type { ChainOfThoughtStep } from "remix-ai-elements/chain-of-thought";
import { CodeBlock } from "remix-ai-elements/code-block";
import type { FileNode } from "remix-ai-elements/file-tree";
import type { Source } from "remix-ai-elements/sources";
import type { CatalogPage } from "../data/catalog.js";

export type CatalogState = "complete" | "running" | "error" | "empty";
export type CatalogStatus = "pending" | "running" | "error" | "success";

export const catalogStates: CatalogState[] = [
  "complete",
  "running",
  "error",
  "empty",
];

export const progressPages: CatalogPage[] = [
  "Chain of Thought",
  "Plan",
  "Queue",
  "Task",
  "Subagent",
  "Terminal",
  "Test Results",
];

export const sources: Source[] = [
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

export const files: FileNode[] = [
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

export function catalogStatus(state: CatalogState): CatalogStatus {
  return state === "empty"
    ? "pending"
    : state === "running"
      ? "running"
      : state === "error"
        ? "error"
        : "success";
}

export function catalogSteps(state: CatalogState): ChainOfThoughtStep[] {
  const status = catalogStatus(state);
  return state === "empty"
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
}
