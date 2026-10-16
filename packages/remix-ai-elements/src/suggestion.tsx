import { css, type Handle, on, type Props } from "remix/component";
import { ActionButton, divPart } from "./internal/parts.js";
import { tokens as t } from "./theme.js";
export const Suggestions = divPart(
  "suggestions",
  css({ display: "flex", flexWrap: "wrap", gap: "8px" }),
);
export type SuggestionProps = Props<"button"> & {
  prompt: string;
  onSelect?: (prompt: string) => void;
};
export function Suggestion(handle: Handle<SuggestionProps>) {
  return () => {
    const { prompt, onSelect, children, mix, ...props } = handle.props;
    return (
      <ActionButton
        {...props}
        data-slot="suggestion"
        mix={[
          css({
            borderColor: t.border,
            borderRadius: "999px",
            color: t.foreground,
            padding: "7px 12px",
            textAlign: "left",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            maxWidth: "100%",
          }),
          on("click", () => onSelect?.(prompt)),
          mix,
        ]}
      >
        {children ?? prompt}
      </ActionButton>
    );
  };
}
