import { css } from "remix/component";
import { tokens as t } from "remix-ai-elements/theme";

export const previewStyles = {
  muted: css({ color: t.subtle }),
  sample: css({
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    padding: "32px",
    minWidth: 0,
    "@media (max-width: 600px)": { padding: "24px 16px" },
  }),
  sampleLabel: css({
    margin: "0 0 12px",
    fontSize: "11px",
    color: t.subtle,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  }),
  sampleGroup: css({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }),
  chatHeader: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "24px 28px 16px",
  }),
  chatTitle: css({ margin: 0, fontSize: "14px", fontWeight: 500 }),
  chatDescription: css({
    margin: "4px 0 0",
    fontSize: "12px",
    color: t.subtle,
  }),
  chatBody: css({
    height: "430px",
    "@media (max-width: 600px)": { height: "390px" },
  }),
  chatContent: css({
    padding: "20px 28px 32px",
    "@media (max-width: 600px)": { padding: "20px 16px 28px" },
  }),
  composer: css({
    padding: "12px 24px 20px",
    "@media (max-width: 600px)": { padding: "12px 16px 20px" },
  }),
  note: css({
    margin: "10px 0 0",
    textAlign: "center",
    color: t.subtle,
    fontSize: "10px",
  }),
};
