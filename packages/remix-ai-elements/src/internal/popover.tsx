import { css, type Handle, type RemixNode, ref } from "remix/component";
import { tokens as t } from "../theme.js";
import { focusRing, scrollbarStyle } from "./parts.js";

export interface PreviewPopoverProps {
  label: RemixNode;
  children: RemixNode;
  ariaLabel: string;
  hover?: boolean;
}
const triggerStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  maxWidth: "100%",
  border: `1px solid ${t.border}`,
  borderRadius: "8px",
  padding: "5px 9px",
  background: t.background,
  color: t.foreground,
  font: "inherit",
  fontSize: "12px",
  cursor: "pointer",
  overflowWrap: "anywhere",
  "&:hover": { background: t.muted },
});
const panelStyle = css({
  position: "fixed",
  inset: "auto",
  boxSizing: "border-box",
  margin: 0,
  width: "256px",
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100dvh - 32px)",
  overflowY: "auto",
  padding: "14px",
  border: `1px solid ${t.border}`,
  borderRadius: "12px",
  background: t.background,
  color: t.foreground,
  boxShadow: "0 6px 24px #0002",
  fontSize: "13px",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});

export function PreviewPopover(handle: Handle<PreviewPopoverProps>) {
  const id = `reai-popover-${handle.id}`;
  return () => (
    <span
      data-slot="preview-popover"
      mix={ref((root: HTMLSpanElement, signal) => {
        const button = root.querySelector("button");
        const panel = root.querySelector<HTMLElement>("[popover]");
        if (!button || !panel) return;
        button.setAttribute(
          "aria-expanded",
          String(panel.matches(":popover-open")),
        );
        let timer: ReturnType<typeof setTimeout> | undefined;
        const clear = () => {
          clearTimeout(timer);
        };
        const hide = () => {
          clear();
          if (panel.matches(":popover-open")) panel.hidePopover();
        };
        const place = () => {
          const rect = button.getBoundingClientRect();
          panel.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - panel.offsetWidth - 16))}px`;
          const below = rect.bottom + 6;
          panel.style.top = `${Math.max(16, Math.min(below + panel.offsetHeight <= window.innerHeight - 16 ? below : rect.top - panel.offsetHeight - 6, window.innerHeight - panel.offsetHeight - 16))}px`;
        };
        panel.addEventListener(
          "toggle",
          () => {
            const open = panel.matches(":popover-open");
            button.setAttribute("aria-expanded", String(open));
            if (open) place();
          },
          { signal },
        );
        const enter = (event: PointerEvent) => {
          clear();
          if (
            handle.props.hover &&
            event.pointerType !== "touch" &&
            !panel.matches(":popover-open")
          ) {
            panel.showPopover();
            place();
          }
        };
        const leave = () => {
          if (handle.props.hover)
            timer = setTimeout(() => {
              if (!root.contains(document.activeElement)) hide();
            }, 150);
        };
        root.addEventListener("pointerenter", enter, { signal });
        root.addEventListener("pointerleave", leave, { signal });
        root.addEventListener(
          "focusout",
          (event) => {
            if (!root.contains(event.relatedTarget as Node | null)) hide();
          },
          { signal },
        );
        window.addEventListener("resize", hide, { signal });
        window.addEventListener(
          "scroll",
          (event) => {
            if (
              !(event.target instanceof Node) ||
              !panel.contains(event.target)
            )
              hide();
          },
          { signal, capture: true },
        );
        signal.addEventListener("abort", clear, { once: true });
      })}
    >
      <button
        type="button"
        popovertarget={id}
        aria-label={handle.props.ariaLabel}
        aria-expanded="false"
        aria-controls={id}
        mix={[triggerStyle, focusRing]}
      >
        {handle.props.label}
      </button>
      <span id={id} popover="auto" mix={[panelStyle, scrollbarStyle]}>
        {handle.props.children}
      </span>
    </span>
  );
}
