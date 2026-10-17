import { css, type Handle, on } from "remix/component";
import { ActionButton } from "remix-ai-elements/primitives";
import { tokens as t } from "remix-ai-elements/theme";
import { officialPatterns } from "../data/catalog.ts";

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

export function Introduction(
  handle: Handle<{
    navigate: (page: (typeof officialPatterns)[number]) => void;
  }>,
) {
  return () => (
    <div mix={column}>
      <h2 mix={css({ margin: 0, fontSize: "18px" })}>
        AI Elements · 21 patterns
      </h2>
      <p mix={muted}>
        All 21 patterns from the official AI Elements navigation, implemented
        with Remix. These are visual examples, not an AI service.
      </p>
      <div
        mix={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "8px",
        })}
      >
        {officialPatterns.map((page) => (
          <ActionButton
            key={page}
            mix={[
              css({
                justifyContent: "space-between",
                borderColor: t.border,
                padding: "12px",
                color: t.foreground,
              }),
              on("click", () => handle.props.navigate(page)),
            ]}
          >
            {page}
            <span aria-hidden="true">↗</span>
          </ActionButton>
        ))}
      </div>
      <p mix={muted}>
        Supporting primitives: Message scroller, Trace, Markdown, and Code
        block. Try Streaming chat for the SDK transport demo. Real models and
        npm publishing are not included.
      </p>
    </div>
  );
}
