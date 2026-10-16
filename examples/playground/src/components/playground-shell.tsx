import { css, type Handle, on, type RemixNode } from "remix/component";
import { darkTheme, lightTheme, tokens as t } from "remix-ai-elements/theme";
import { Icon } from "../../../../packages/remix-ai-elements/src/internal/icon.js";

const shell = css({
  minHeight: "100dvh",
  background: t.background,
  color: t.foreground,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: "14px",
  lineHeight: 1.5,
  "& *, & *::before, & *::after": { boxSizing: "border-box" },
  "& button, & select, & textarea": { fontFamily: "inherit" },
  "& a": { color: "inherit" },
});
const topbar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "20px 32px",
  borderBottom: `1px solid ${t.border}`,
  "@media (max-width: 760px)": { padding: "16px 20px" },
});
const brand = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  fontSize: "16px",
  textDecoration: "none",
});
const muted = css({ color: t.subtle });
const badge = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "3px 8px",
  borderRadius: "6px",
  border: `1px solid ${t.border}`,
  color: t.subtle,
  fontSize: "11px",
  whiteSpace: "nowrap",
});
const inline = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});
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
const layout = css({
  display: "grid",
  gridTemplateColumns: "196px minmax(0, 1fr)",
  maxWidth: "1280px",
  margin: "0 auto",
  "@media (max-width: 760px)": { display: "block" },
});

export interface PlaygroundShellProps {
  dark: boolean;
  onToggleTheme: () => void;
  navigation: RemixNode;
  children?: RemixNode;
}

export function PlaygroundShell(handle: Handle<PlaygroundShellProps>) {
  return () => (
    <div mix={[handle.props.dark ? darkTheme : lightTheme, shell]}>
      <header mix={topbar}>
        <a href="#" mix={brand}>
          <Icon name="code" size={20} />
          <span>
            remix <span mix={muted}>/</span> ai elements
          </span>
        </a>
        <div mix={inline}>
          <span mix={badge}>Remix 3</span>
          <button
            type="button"
            aria-label={
              handle.props.dark
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title={
              handle.props.dark
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            mix={[quietButton, on("click", () => handle.props.onToggleTheme())]}
          >
            <Icon name={handle.props.dark ? "sun" : "moon"} />
          </button>
        </div>
      </header>
      <div mix={layout}>
        {handle.props.navigation}
        {handle.props.children}
      </div>
    </div>
  );
}
