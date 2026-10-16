import { css, type Handle, on, type Props } from "remix/component";
import { Icon } from "./internal/icon.js";
import { ActionButton, focusRing, scrollbarStyle } from "./internal/parts.js";
import { tokens as t } from "./theme.js";

export type CodeBlockProps = Omit<Props<"div">, "children"> & {
  code: string;
  language?: string;
  filename?: string;
  wrap?: boolean;
  lineNumbers?: boolean;
  variant?: "default" | "error";
  copyLabel?: string;
};

const blockStyle = css({
  minWidth: 0,
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  borderRadius: t.radius,
  background: t.muted,
  color: t.foreground,
  border: `1px solid ${t.border}`,
  fontSize: "14px",
  '&[data-variant="error"]': { color: t.destructive },
});
const headerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  padding: "10px 12px 0 16px",
  color: t.subtle,
  fontSize: "12px",
});
const preStyle = css({
  margin: 0,
  padding: "8px 16px 16px",
  maxHeight: "360px",
  overflow: "auto",
  outlineOffset: "-3px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: "13px",
  lineHeight: 1.7,
  tabSize: 2,
  '&[data-wrap="true"]': { whiteSpace: "pre-wrap", overflowWrap: "anywhere" },
});
const lineStyle = css({
  display: "block",
  minHeight: "1.7em",
  "&::before": {
    content: "attr(data-line)",
    display: "inline-block",
    width: "2.5em",
    marginRight: "12px",
    color: t.subtle,
    userSelect: "none",
    textAlign: "right",
  },
});

export function CodeBlockCopyButton(
  handle: Handle<{ value: string; label?: string }>,
) {
  let result = "";
  let timeout: ReturnType<typeof setTimeout> | undefined;
  handle.signal.addEventListener("abort", () => clearTimeout(timeout));
  async function copy() {
    try {
      await navigator.clipboard.writeText(handle.props.value);
      result = "Copied";
    } catch {
      result = "Copy failed";
    }
    if (handle.signal.aborted) return;
    void handle.update();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = "";
      void handle.update();
    }, 2000);
  }
  return () => (
    <ActionButton
      aria-label={result || handle.props.label || "Copy code"}
      title={result || handle.props.label || "Copy code"}
      mix={on("click", copy)}
    >
      <Icon name={result === "Copied" ? "check" : "copy"} />
      <span aria-live="polite">{result}</span>
    </ActionButton>
  );
}

export function CodeBlock(handle: Handle<CodeBlockProps>) {
  return () => {
    const {
      code,
      language = "text",
      filename,
      wrap = false,
      lineNumbers = false,
      variant = "default",
      copyLabel,
      mix,
      ...props
    } = handle.props;
    return (
      <div
        {...props}
        data-slot="code-block"
        data-variant={variant}
        mix={[blockStyle, mix]}
      >
        <div data-slot="code-block-header" mix={headerStyle}>
          <span>{filename || language}</span>
          <CodeBlockCopyButton value={code} label={copyLabel} />
        </div>
        <pre
          data-slot="code-block-content"
          data-wrap={String(wrap)}
          tabIndex={0}
          aria-label={filename || `${language} code`}
          mix={[preStyle, scrollbarStyle, focusRing]}
        >
          <code>
            {lineNumbers
              ? code
                  .replace(/\n$/, "")
                  .split("\n")
                  .map((line, index) => (
                    <span key={index} data-line={index + 1} mix={lineStyle}>
                      {line || "\n"}
                    </span>
                  ))
              : code}
          </code>
        </pre>
      </div>
    );
  };
}
