import { css, type Handle, type RemixNode } from "remix/component";
import { Icon } from "remix-ai-elements/primitives";
import {
  PromptInput,
  PromptInputAction,
  PromptInputStop,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  type PromptStatus,
} from "remix-ai-elements/prompt-input";
import { tokens as t } from "remix-ai-elements/theme";
import { previewStyles } from "./preview-styles.ts";

export function Example(
  handle: Handle<{ label: string; children?: RemixNode }>,
) {
  return () => (
    <section>
      <h2 mix={previewStyles.sampleLabel}>{handle.props.label}</h2>
      {handle.props.children}
    </section>
  );
}

export function PromptDemo(
  handle: Handle<{ status?: PromptStatus; label?: string }>,
) {
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
        <span mix={previewStyles.muted}>⌄</span>
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

export const previewTextStyles = {
  error: css({
    color: t.destructive,
    fontSize: "12px",
    margin: "8px 0 0",
  }),
};
