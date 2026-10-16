import {
  type CSSMixinDescriptor,
  css,
  type Handle,
  type Props,
} from "remix/component";
import { tokens as t } from "../theme.js";

export const focusRing: CSSMixinDescriptor = css({
  "&:focus-visible": { outline: `2px solid ${t.ring}`, outlineOffset: "3px" },
});

export function divPart(slot: string, styles: CSSMixinDescriptor) {
  return function Part(handle: Handle<Props<"div">>) {
    return () => {
      const { mix, ...props } = handle.props;
      return <div {...props} data-slot={slot} mix={[styles, mix]} />;
    };
  };
}

export function spanPart(slot: string, styles: CSSMixinDescriptor) {
  return function Part(handle: Handle<Props<"span">>) {
    return () => {
      const { mix, ...props } = handle.props;
      return <span {...props} data-slot={slot} mix={[styles, mix]} />;
    };
  };
}

const buttonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "6px",
  minWidth: "30px",
  minHeight: "30px",
  background: "transparent",
  color: t.subtle,
  border: "1px solid transparent",
  borderRadius: "8px",
  font: "inherit",
  fontSize: "12px",
  cursor: "pointer",
  "&:hover:not(:disabled)": { background: t.muted, color: t.foreground },
  "&:disabled": { opacity: 0.45, cursor: "not-allowed" },
});

export function ActionButton(handle: Handle<Props<"button">>) {
  return () => {
    const { mix, ...props } = handle.props;
    return (
      <button type="button" {...props} mix={[buttonStyle, focusRing, mix]} />
    );
  };
}
