import type { Handle } from "remix/component";
import { CatalogPreview } from "../catalog.tsx";
import { isCatalogPage } from "../data/catalog.ts";
import type { Page } from "../data/pages.ts";
import { CodeBlockPreview } from "./code-block-preview.tsx";
import { MarkdownPreview } from "./markdown-preview.tsx";
import { MessagePreview } from "./message-preview.tsx";
import { MessageScrollerPreview } from "./message-scroller-preview.tsx";
import { PromptInputPreview } from "./prompt-input-preview.tsx";
import { ReasoningPreview } from "./reasoning-preview.tsx";
import { ToolPreview } from "./tool-preview.tsx";
import { TracePreview } from "./trace-preview.tsx";

export function PagePreview(handle: Handle<{ page: Page }>) {
  return () => {
    switch (handle.props.page) {
      case "Message":
        return <MessagePreview />;
      case "Prompt input":
        return <PromptInputPreview />;
      case "Reasoning":
        return <ReasoningPreview />;
      case "Tool":
        return <ToolPreview />;
      case "Trace":
        return <TracePreview />;
      case "Markdown":
        return <MarkdownPreview />;
      case "Code block":
        return <CodeBlockPreview />;
      case "Message scroller":
        return <MessageScrollerPreview />;
      default:
        return isCatalogPage(handle.props.page) ? (
          <CatalogPreview page={handle.props.page} />
        ) : null;
    }
  };
}
