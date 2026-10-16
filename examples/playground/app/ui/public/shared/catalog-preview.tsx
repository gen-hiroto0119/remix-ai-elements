import { css, type Handle, on, type RemixNode } from "remix/component";
import { tokens as t } from "remix-ai-elements/theme";
import { focusRing } from "../../../../../../packages/remix-ai-elements/dist/internal/parts.js";
import { type CatalogState, catalogStates } from "./catalog-data.tsx";

const column = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
  maxWidth: "580px",
  margin: "0 auto",
  padding: "32px 24px",
  minWidth: 0,
  "@media (max-width: 600px)": { padding: "24px 16px" },
});
const muted = css({ color: t.subtle, fontSize: "12px", margin: 0 });
const toolbar = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  paddingBottom: "16px",
  borderBottom: `1px solid ${t.border}`,
});
const selectStyle = css({
  padding: "6px 10px",
  border: `1px solid ${t.border}`,
  background: t.background,
  color: t.foreground,
  borderRadius: "8px",
  font: "inherit",
  fontSize: "12px",
  maxWidth: "100%",
});

export const catalogStyles = { column, muted, toolbar };

export function CatalogPreviewContainer(
  handle: Handle<{
    state: CatalogState;
    showState: boolean;
    onStateChange: (state: CatalogState) => void;
    children?: RemixNode;
  }>,
) {
  return () => (
    <div mix={column}>
      {handle.props.showState ? (
        <div mix={toolbar}>
          <label>
            State{" "}
            <select
              aria-label="Example state"
              mix={[
                selectStyle,
                focusRing,
                on("change", (event) =>
                  handle.props.onStateChange(
                    event.currentTarget.value as CatalogState,
                  ),
                ),
              ]}
            >
              {catalogStates.map((value) => (
                <option
                  key={value}
                  value={value}
                  selected={handle.props.state === value}
                >
                  {value[0]!.toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <span mix={muted}>Fixed data · not live execution</span>
        </div>
      ) : null}
      {handle.props.children}
      <p mix={muted}>
        Visual preview only. Actions update local examples, not your project or
        an AI service.
      </p>
    </div>
  );
}
