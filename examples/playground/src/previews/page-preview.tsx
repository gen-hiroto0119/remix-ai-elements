import type { Handle } from "remix/component";
import { CatalogPreview } from "../catalog.js";
import { isCatalogPage } from "../data/catalog.js";
import type { Page } from "../data/pages.js";
import { CodeBlockPreview } from "./code-block-preview.js";
import { MarkdownPreview } from "./markdown-preview.js";
import { MessagePreview } from "./message-preview.js";
import { MessageScrollerPreview } from "./message-scroller-preview.js";
import { PromptInputPreview } from "./prompt-input-preview.js";
import { ReasoningPreview } from "./reasoning-preview.js";
import { ToolPreview } from "./tool-preview.js";
import { TracePreview } from "./trace-preview.js";

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
