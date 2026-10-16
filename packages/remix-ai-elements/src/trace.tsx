import {
  css,
  type Handle,
  on,
  type Props,
  type RemixNode,
} from "remix/component";
import { Icon } from "./internal/icon.js";
import { divPart, focusRing, spanPart } from "./internal/parts.js";
import { tokens as t } from "./theme.js";

export type TraceStatus = "pending" | "running" | "success" | "error";
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
export const Trace = divPart(
  "trace",
  css({ display: "flex", flexDirection: "column", minWidth: 0, gap: "8px" }),
);
export const TraceTitle = spanPart(
  "trace-title",
  css({ minWidth: 0, overflowWrap: "anywhere" }),
);
export const TraceDescription = spanPart(
  "trace-description",
  css({
    flexShrink: 0,
    color: t.subtle,
    fontVariantNumeric: "tabular-nums",
    fontSize: "12px",
  }),
);
export const TraceIcon = spanPart(
  "trace-icon",
  css({
    display: "inline-flex",
    flexShrink: 0,
    width: "16px",
    height: "16px",
    alignItems: "center",
    justifyContent: "center",
  }),
);

const lineStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
  fontSize: "14px",
  lineHeight: 1.5,
  color: t.subtle,
  '&[data-status="pending"]': { opacity: 0.65 },
  '&[data-status="error"]': { color: t.destructive },
});
export function TraceLine(
  handle: Handle<Props<"span"> & { status?: TraceStatus }>,
) {
  return () => {
    const { status, mix, ...props } = handle.props;
    return (
      <span
        {...props}
        data-slot="trace-line"
        data-status={status}
        mix={[lineStyle, mix]}
      />
    );
  };
}

export type TraceDisclosureProps = Omit<Props<"details">, "open" | "title"> & {
  title: RemixNode;
  defaultOpen?: boolean;
} & (
    | { open?: undefined; onOpenChange?: (open: boolean) => void }
    | { open: boolean; onOpenChange: (open: boolean) => void }
  );
const disclosureStyle = css({
  minWidth: 0,
  "&[open] > summary > [data-chevron]": { transform: "rotate(90deg)" },
});
const summaryStyle = css({
  display: "flex",
  alignItems: "center",
  width: "fit-content",
  maxWidth: "100%",
  gap: "6px",
  cursor: "pointer",
  borderRadius: "8px",
  color: t.subtle,
  listStyle: "none",
  "&::-webkit-details-marker": { display: "none" },
  "&:hover": { color: t.foreground },
  "& > [data-chevron]": { display: "flex", flexShrink: 0 },
});
const contentStyle = css({
  margin: "8px 0 4px 7px",
  borderLeft: `1px solid ${t.border}`,
  padding: "0 4px 0 16px",
  fontSize: "14px",
  lineHeight: 1.625,
  color: t.subtle,
  overflowWrap: "anywhere",
});
export function TraceDisclosure(handle: Handle<TraceDisclosureProps>) {
  let expanded = handle.props.defaultOpen ?? false;
  return () => {
    const {
      title,
      children,
      open,
      defaultOpen: _defaultOpen,
      onOpenChange,
      mix,
      ...props
    } = handle.props;
    return (
      <details
        {...props}
        data-slot="trace-disclosure"
        open={open ?? expanded}
        mix={[
          disclosureStyle,
          on("toggle", (event) => {
            const next = event.currentTarget.open;
            if (next === (open ?? expanded)) return;
            expanded = next;
            onOpenChange?.(next);
            void handle.update();
          }),
          mix,
        ]}
      >
        <summary mix={[summaryStyle, focusRing]}>
          {title}
          <span data-chevron>
            <Icon name="chevron" size={12} />
          </span>
        </summary>
        <div data-slot="trace-content" mix={contentStyle}>
          {children}
        </div>
      </details>
    );
  };
}
