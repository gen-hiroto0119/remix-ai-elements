import { css, type Handle } from "remix/component";
import { PreviewPopover } from "./internal/popover.js";
import { tokens as t } from "./theme.js";
export interface ContextProps {
  input: number;
  output: number;
  reasoning?: number;
  limit: number;
}
const finite = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;
const format = (value: number) =>
  value < 1000
    ? String(value)
    : `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
export function Context(handle: Handle<ContextProps>) {
  return () => {
    const { input, output, reasoning = 0, limit } = handle.props;
    const rows = [
      { label: "Input", value: finite(input) },
      { label: "Output", value: finite(output) },
      { label: "Reasoning", value: finite(reasoning) },
    ];
    const used = rows.reduce((sum, row) => sum + row.value, 0);
    const capacity = finite(limit);
    const percent = capacity > 0 ? Math.round((used / capacity) * 100) : 0;
    const rowStyle = css({
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
    });
    return (
      <PreviewPopover
        hover
        label={capacity ? `${percent}% context` : "Context unavailable"}
        ariaLabel="Context usage"
      >
        <span
          mix={css({ display: "flex", flexDirection: "column", gap: "10px" })}
        >
          <span mix={rowStyle}>
            <strong>Context</strong>
            <span>
              {format(used)} / {capacity ? format(capacity) : "—"}
            </span>
          </span>
          <progress
            aria-label="Context used"
            max={100}
            value={Math.min(100, percent)}
            mix={css({
              width: "100%",
              height: "6px",
              accentColor: t.foreground,
            })}
          />
          {rows.map((row) => (
            <span key={row.label} mix={rowStyle}>
              <span mix={css({ color: t.subtle })}>{row.label}</span>
              <span>{format(row.value)}</span>
            </span>
          ))}
        </span>
      </PreviewPopover>
    );
  };
}
