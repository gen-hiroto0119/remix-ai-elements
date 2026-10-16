import { css, type Handle, on, type Props } from "remix/component";
import { Icon } from "./internal/icon.js";
import {
  ActionButton,
  divPart,
  focusRing,
  scrollbarStyle,
} from "./internal/parts.js";
import { tokens as t } from "./theme.js";

export type PromptStatus = "ready" | "submitted" | "streaming" | "error";
const promptStyle = css({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
  border: "1px solid transparent",
  borderRadius: t.radius,
  background: t.muted,
  "&:focus-within": {
    borderColor: t.ring,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${t.ring} 20%, transparent)`,
  },
  '&[data-status="error"]': { borderColor: t.destructive },
});
export function PromptInput(
  handle: Handle<Props<"form"> & { status?: PromptStatus }>,
) {
  return () => {
    const { status = "ready", mix, ...props } = handle.props;
    return (
      <form
        {...props}
        data-slot="prompt-input"
        data-status={status}
        mix={[
          promptStyle,
          on("submit", (event) => event.preventDefault()),
          mix,
        ]}
      />
    );
  };
}

const textareaStyle = css({
  boxSizing: "border-box",
  width: "100%",
  minHeight: "76px",
  maxHeight: "240px",
  fieldSizing: "content",
  resize: "none",
  overflowY: "auto",
  padding: "12px 14px",
  border: 0,
  outline: "none",
  borderRadius: "16px",
  background: "transparent",
  color: t.foreground,
  font: "inherit",
  fontSize: "14px",
  lineHeight: 1.625,
  "&::placeholder": { color: t.subtle },
  "&:disabled": { opacity: 0.5 },
});
export function PromptInputTextarea(handle: Handle<Props<"textarea">>) {
  return () => {
    const { mix, ...props } = handle.props;
    return (
      <textarea
        aria-label="Message"
        placeholder="Ask anything…"
        rows={2}
        {...props}
        data-slot="prompt-input-textarea"
        mix={[textareaStyle, scrollbarStyle, mix]}
      />
    );
  };
}
export const PromptInputToolbar = divPart(
  "prompt-input-toolbar",
  css({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6px",
    padding: "0 10px 8px",
    color: t.subtle,
    fontSize: "12px",
  }),
);
export const PromptInputAction = ActionButton;
const submitStyle = css({
  marginLeft: "auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "30px",
  height: "30px",
  padding: 0,
  border: 0,
  borderRadius: "50%",
  background: t.primary,
  color: t.primaryForeground,
  cursor: "pointer",
  "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
});
export function PromptInputSubmit(handle: Handle<Props<"button">>) {
  return () => {
    const { mix, children, ...props } = handle.props;
    return (
      <button
        type="submit"
        aria-label="Send message"
        {...props}
        mix={[submitStyle, focusRing, mix]}
      >
        {children || <Icon name="arrow-up" />}
      </button>
    );
  };
}
export function PromptInputStop(handle: Handle<Props<"button">>) {
  return () => {
    const { mix, children, ...props } = handle.props;
    return (
      <button
        type="button"
        aria-label="Stop generation"
        {...props}
        mix={[submitStyle, focusRing, mix]}
      >
        {children || <Icon name="stop" size={12} />}
      </button>
    );
  };
}
