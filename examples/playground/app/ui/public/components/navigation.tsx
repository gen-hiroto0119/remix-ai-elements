import { css, type Handle, on } from "remix/component";
import { tokens as t } from "remix-ai-elements/theme";
import { Icon } from "../../../../../../packages/remix-ai-elements/dist/internal/icon.js";
import { scrollbarStyle } from "../../../../../../packages/remix-ai-elements/dist/internal/parts.js";
import { items, type Page } from "../data/pages.ts";

const sidebar = css({
  padding: "36px 20px 32px 28px",
  borderRight: `1px solid ${t.border}`,
  "@media (max-width: 760px)": {
    borderRight: 0,
    borderBottom: `1px solid ${t.border}`,
    padding: "12px 20px",
  },
});
const nav = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  maxHeight: "calc(100dvh - 180px)",
  overflowY: "auto",
  position: "sticky",
  top: "20px",
  "@media (max-width: 760px)": {
    flexDirection: "row",
    position: "static",
    maxHeight: "none",
    overflowX: "auto",
    padding: "2px 0 6px",
  },
});
const navButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",
  whiteSpace: "nowrap",
  width: "100%",
  padding: "8px 10px",
  background: "transparent",
  color: t.subtle,
  border: 0,
  borderRadius: "7px",
  font: "inherit",
  fontSize: "13px",
  textAlign: "left",
  cursor: "pointer",
  '&[aria-current="page"]': {
    background: t.muted,
    color: t.foreground,
    fontWeight: 500,
  },
  "&:hover": { color: t.foreground },
  "&:focus-visible": { outline: `2px solid ${t.ring}`, outlineOffset: "-2px" },
  "@media (max-width: 760px)": { width: "auto" },
});
const navLabel = css({
  margin: "0 10px 16px",
  fontSize: "11px",
  fontWeight: 500,
  color: t.subtle,
  "@media (max-width: 760px)": { display: "none" },
});

export function Navigation(
  handle: Handle<{
    page: Page;
    onNavigate: (page: Page) => void;
  }>,
) {
  return () => (
    <aside mix={sidebar}>
      <p mix={navLabel}>Playground</p>
      <nav aria-label="Components" mix={[nav, scrollbarStyle]}>
        {items.map((item) => (
          <button
            key={item}
            type="button"
            aria-current={handle.props.page === item ? "page" : undefined}
            mix={[navButton, on("click", () => handle.props.onNavigate(item))]}
          >
            {item}
            {item === "Chat" ? <Icon name="message" size={13} /> : null}
          </button>
        ))}
      </nav>
    </aside>
  );
}
