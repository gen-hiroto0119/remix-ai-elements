import { css, type Handle, on, type Props } from "remix/component";
import { Icon } from "./internal/icon.js";
import { ActionButton } from "./internal/parts.js";
import { tokens as t } from "./theme.js";
export type ConfirmationProps = Omit<Props<"div">, "title"> & {
  title: string;
  description?: string;
  state?: "pending" | "approved" | "denied";
  onDecision?: (approved: boolean) => void;
  approveLabel?: string;
  denyLabel?: string;
  disabled?: boolean;
};
export function Confirmation(handle: Handle<ConfirmationProps>) {
  return () => {
    const {
      title,
      description,
      state = "pending",
      onDecision,
      approveLabel = "Allow",
      denyLabel = "Deny",
      disabled,
      children,
      mix,
      ...props
    } = handle.props;
    return (
      <div
        {...props}
        data-slot="confirmation"
        data-state={state}
        mix={[
          css({
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            padding: "16px",
            border: `1px solid ${t.border}`,
            borderRadius: "12px",
            color: t.foreground,
          }),
          mix,
        ]}
      >
        <Icon
          name={
            state === "approved"
              ? "check"
              : state === "denied"
                ? "alert"
                : "terminal"
          }
        />
        <div
          mix={css({
            flex: "1 1 160px",
            minWidth: 0,
            overflowWrap: "anywhere",
          })}
        >
          <strong>{title}</strong>
          {description ? (
            <p
              mix={css({
                margin: "4px 0 0",
                fontSize: "13px",
                color: t.subtle,
              })}
            >
              {description}
            </p>
          ) : null}
          {children}
        </div>
        {state === "pending" ? (
          <div mix={css({ display: "flex", gap: "6px", flexWrap: "wrap" })}>
            <ActionButton
              disabled={disabled || !onDecision}
              mix={[
                css({
                  borderColor: t.border,
                  padding: "6px 10px",
                  color: t.foreground,
                }),
                on("click", () => onDecision?.(false)),
              ]}
            >
              {denyLabel}
            </ActionButton>
            <ActionButton
              disabled={disabled || !onDecision}
              mix={[
                css({
                  background: t.primary,
                  color: t.primaryForeground,
                  padding: "6px 10px",
                  "&:hover:not(:disabled)": {
                    background: t.primary,
                    color: t.primaryForeground,
                    opacity: 0.85,
                  },
                }),
                on("click", () => onDecision?.(true)),
              ]}
            >
              {approveLabel}
            </ActionButton>
          </div>
        ) : (
          <span role="status">
            {state === "approved" ? "Approved" : "Denied"}
          </span>
        )}
      </div>
    );
  };
}
