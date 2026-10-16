import { css, type Handle, type RemixNode } from "remix/component";
import { tokens as t } from "remix-ai-elements/theme";
import type { Page } from "../data/pages.ts";

const main = css({
  minWidth: 0,
  padding: "42px 48px 32px",
  "@media (max-width: 1000px)": { padding: "32px 28px" },
  "@media (max-width: 760px)": { padding: "28px 20px" },
});
const heading = css({
  margin: "0 0 8px",
  fontSize: "32px",
  lineHeight: 1.2,
  fontWeight: 600,
  letterSpacing: "-0.045em",
});
const subtitle = css({
  margin: 0,
  color: t.subtle,
  fontSize: "14px",
  maxWidth: "580px",
});
const eyebrow = css({
  margin: "0 0 14px",
  fontSize: "10px",
  color: t.subtle,
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  fontWeight: 500,
});
const controls = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  margin: "28px 0 12px",
  fontSize: "12px",
  color: t.subtle,
});
const preview = css({
  overflow: "hidden",
  border: `1px solid ${t.border}`,
  borderRadius: "20px",
  minWidth: 0,
  background: t.background,
});
const footer = css({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
  fontSize: "11px",
  color: t.subtle,
  marginTop: "16px",
});
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

export interface PreviewPanelProps {
  page: Page;
  description: string;
  dark: boolean;
  controls?: RemixNode;
  children?: RemixNode;
}

export function PreviewPanel(handle: Handle<PreviewPanelProps>) {
  return () => (
    <main mix={main}>
      <p mix={eyebrow}>Remix-native components</p>
      <h1 mix={heading}>{handle.props.page}</h1>
      <p mix={subtitle}>{handle.props.description}</p>
      <div mix={controls}>
        <span mix={inline}>
          <span>Preview</span>
          <span mix={badge}>{handle.props.dark ? "Dark" : "Light"}</span>
        </span>
        <div mix={inline}>{handle.props.controls}</div>
      </div>
      <div mix={preview}>{handle.props.children}</div>
      <div mix={footer}>
        <span>Built with remix/component · css() / mix</span>
        <span>Static fixtures · No AI connection</span>
      </div>
    </main>
  );
}
