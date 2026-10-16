import { css, type Handle, on, type Props } from "remix/component";
import { ActionButton } from "./internal/parts.js";
import { tokens as t } from "./theme.js";
export type CheckpointProps = Props<"div"> & {
  label: string;
  onRestore?: () => void;
  disabled?: boolean;
  restoreLabel?: string;
};
const marker = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: t.subtle,
  fontSize: "12px",
  margin: "8px 0",
  "&::before, &::after": {
    content: '""',
    height: "1px",
    background: t.border,
    flex: "1 1 16px",
    minWidth: "8px",
  },
});
export function Checkpoint(handle: Handle<CheckpointProps>) {
  return () => {
    const {
      label,
      onRestore,
      disabled,
      restoreLabel = "Restore",
      mix,
      children,
      ...props
    } = handle.props;
    return (
      <div {...props} data-slot="checkpoint" mix={[marker, mix]}>
        <span
          mix={css({
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            minWidth: 0,
            overflowWrap: "anywhere",
          })}
        >
          {label}
          {onRestore ? (
            <ActionButton
              disabled={disabled}
              aria-label={`${restoreLabel}: ${label}`}
              mix={[
                css({ borderColor: t.border, color: t.foreground }),
                on("click", () => onRestore()),
              ]}
            >
              {restoreLabel}
            </ActionButton>
          ) : null}
          {children}
        </span>
      </div>
    );
  };
}
