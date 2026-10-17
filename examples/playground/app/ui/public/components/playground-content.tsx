import { css, type Handle, on } from "remix/component";
import { tokens as t } from "remix-ai-elements/theme";
import { isCatalogPage, officialUrl } from "../data/catalog.ts";
import { descriptions, type Page, type Scenario } from "../data/pages.ts";
import { ChatPreview } from "../previews/chat-preview.tsx";
import { PagePreview } from "../previews/page-preview.tsx";
import { StreamingChatPreview } from "../previews/streaming-chat-preview.tsx";
import { Introduction } from "./introduction.tsx";
import { PreviewPanel } from "./preview-panel.tsx";

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

export function PlaygroundContent(
  handle: Handle<{
    page: Page;
    dark: boolean;
    onNavigate: (page: Page) => void;
    localReference?: boolean;
  }>,
) {
  let scenario: Scenario = "complete";
  const update = () => {
    void handle.update();
  };

  return () => {
    const { page, dark } = handle.props;
    const referenceUrl =
      page === "Streaming chat"
        ? "https://ai-sdk.dev/docs/ai-sdk-ui/transport"
        : [
              "Introduction",
              "Message scroller",
              "Trace",
              "Markdown",
              "Code block",
            ].includes(page)
          ? "https://ui.shadcn.com/docs/ai-elements"
          : officialUrl(page);
    const controls = (
      <>
        {page === "Chat" ? (
          <label>
            State{" "}
            <select
              aria-label="Conversation state"
              mix={[
                quietButton,
                on("change", (event) => {
                  scenario = event.currentTarget.value as Scenario;
                  update();
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
              if (
                !handle.props.localReference ||
                isCatalogPage(page) ||
                page === "Introduction" ||
                page === "Streaming chat"
              ) {
                window.open(referenceUrl, "_blank", "noopener,noreferrer");
                return;
              }
              url.port = "5174";
              url.hash = "";
              window.open(url, "_blank", "noopener,noreferrer");
            }),
          ]}
        >
          {page === "Streaming chat"
            ? "AI SDK transport ↗"
            : "shadcn reference ↗"}
        </button>
      </>
    );
    const preview =
      page === "Introduction" ? (
        <Introduction navigate={handle.props.onNavigate} />
      ) : page === "Chat" ? (
        <ChatPreview scenario={scenario} />
      ) : page === "Streaming chat" ? (
        <StreamingChatPreview />
      ) : (
        <PagePreview key={page} page={page} />
      );

    return (
      <PreviewPanel
        page={page}
        description={descriptions[page]}
        dark={dark}
        controls={controls}
      >
        {preview}
      </PreviewPanel>
    );
  };
}
