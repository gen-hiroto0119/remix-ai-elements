import { css, type Handle, on, type Props, ref } from "remix/component";
import { Icon } from "./internal/icon.js";
import { ActionButton, divPart, scrollbarStyle } from "./internal/parts.js";
import { tokens as t } from "./theme.js";

const viewportStyle = css({
  minWidth: 0,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  "&:focus-visible": { outline: `2px solid ${t.ring}`, outlineOffset: "-2px" },
});
export function MessageScroller(
  handle: Handle<Props<"section"> & { autoScroll?: boolean }>,
) {
  const follow = ref((viewport: HTMLElement, signal) => {
    let atBottom = true;
    viewport.addEventListener(
      "scroll",
      () => {
        atBottom =
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <
          32;
      },
      { signal },
    );
    const observer = new ResizeObserver(() => {
      if (handle.props.autoScroll && atBottom)
        viewport.scrollTop = viewport.scrollHeight;
    });
    observer.observe(viewport);
    if (viewport.firstElementChild)
      observer.observe(viewport.firstElementChild);
    signal.addEventListener("abort", () => observer.disconnect(), {
      once: true,
    });
  });
  return () => {
    const { mix, autoScroll, ...props } = handle.props;
    return (
      <section
        aria-label="Conversation"
        tabIndex={0}
        {...props}
        data-slot="message-scroller"
        mix={[
          viewportStyle,
          scrollbarStyle,
          autoScroll ? follow : undefined,
          mix,
        ]}
      />
    );
  };
}
export const MessageScrollerContent = divPart(
  "message-scroller-content",
  css({
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    gap: "32px",
    padding: "24px",
  }),
);
const buttonStyle = css({
  border: `1px solid ${t.border}`,
  background: t.background,
  borderRadius: "50%",
});

export function MessageScrollerButton(
  handle: Handle<Props<"button"> & { targetId: string }>,
) {
  return () => {
    const { targetId, children, mix, ...props } = handle.props;
    return (
      <ActionButton
        aria-label="Scroll to latest message"
        {...props}
        mix={[
          buttonStyle,
          on("click", () => {
            const viewport = document.getElementById(targetId);
            if (viewport) viewport.scrollTop = viewport.scrollHeight;
          }),
          mix,
        ]}
      >
        {children || <Icon name="arrow-down" />}
      </ActionButton>
    );
  };
}
