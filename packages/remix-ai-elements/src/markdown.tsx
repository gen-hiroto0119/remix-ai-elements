import { type MarkedToken, marked, type Token } from "marked";
import {
  createElement,
  css,
  type Handle,
  type Props,
  type RemixNode,
} from "remix/component";
import { CodeBlock } from "./code-block.js";
import { scrollbarStyle } from "./internal/parts.js";
import { tokens as t } from "./theme.js";

export type MarkdownProps = Omit<Props<"div">, "children"> & {
  content: string;
};

const markedTokenTypes: Record<MarkedToken["type"], true> = {
  blockquote: true,
  br: true,
  code: true,
  codespan: true,
  def: true,
  del: true,
  em: true,
  escape: true,
  heading: true,
  hr: true,
  html: true,
  image: true,
  link: true,
  list: true,
  list_item: true,
  paragraph: true,
  space: true,
  strong: true,
  table: true,
  text: true,
};

function isMarkedToken(token: Token): token is MarkedToken {
  return Object.hasOwn(markedTokenTypes, token.type);
}

function safeHref(href: string): string | undefined {
  try {
    const url = new URL(href, "https://relative.invalid");
    return ["http:", "https:", "mailto:"].includes(url.protocol)
      ? href
      : undefined;
  } catch {
    return undefined;
  }
}

function renderTokens(tokens: Token[]): RemixNode {
  return tokens.map((token): RemixNode => {
    if (!isMarkedToken(token)) return token.raw;
    switch (token.type) {
      case "space":
        return null;
      case "def":
        return null;
      case "paragraph":
        return <p>{renderTokens(token.tokens)}</p>;
      case "text":
        return token.tokens ? renderTokens(token.tokens) : token.text;
      case "escape":
        return token.text;
      case "strong":
        return <strong>{renderTokens(token.tokens)}</strong>;
      case "em":
        return <em>{renderTokens(token.tokens)}</em>;
      case "del":
        return <del>{renderTokens(token.tokens)}</del>;
      case "codespan":
        return <code>{token.text}</code>;
      case "code":
        return (
          <CodeBlock
            code={token.text}
            language={token.lang?.split(/\s/)[0] || "text"}
          />
        );
      case "heading":
        return createElement(
          `h${token.depth}` as "h1",
          {},
          renderTokens(token.tokens),
        );
      case "blockquote":
        return <blockquote>{renderTokens(token.tokens)}</blockquote>;
      case "br":
        return <br />;
      case "hr":
        return <hr />;
      case "link": {
        const href = safeHref(token.href);
        return href ? (
          <a
            href={href}
            title={token.title || undefined}
            rel="noopener noreferrer"
          >
            {renderTokens(token.tokens)}
          </a>
        ) : (
          renderTokens(token.tokens)
        );
      }
      case "image":
        return <span>[Image: {token.text}]</span>;
      case "html":
        return token.text;
      case "list": {
        const items = token.items.map((item, index) => (
          <li key={index}>
            {item.task ? (
              <input
                type="checkbox"
                checked={item.checked}
                disabled
                aria-label={item.text}
              />
            ) : null}
            {renderTokens(item.tokens)}
          </li>
        ));
        return token.ordered ? (
          <ol start={typeof token.start === "number" ? token.start : 1}>
            {items}
          </ol>
        ) : (
          <ul>{items}</ul>
        );
      }
      case "table":
        return (
          <div
            data-table-scroll
            tabIndex={0}
            role="region"
            aria-label="Table"
            mix={scrollbarStyle}
          >
            <table>
              <thead>
                <tr>
                  {token.header.map((cell, index) => (
                    <th key={index} scope="col">
                      {renderTokens(cell.tokens)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {token.rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, column) => (
                      <td key={column}>{renderTokens(cell.tokens)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return token.raw;
    }
  });
}

const markdownStyle = css({
  minWidth: 0,
  color: t.foreground,
  fontSize: "14px",
  lineHeight: 1.75,
  overflowWrap: "anywhere",
  "& > :first-child": { marginTop: 0 },
  "& > :last-child": { marginBottom: 0 },
  "& p": { margin: "0 0 14px" },
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    margin: "22px 0 12px",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "-0.02em",
  },
  "& h1": { fontSize: "24px" },
  "& h2": { fontSize: "20px" },
  "& h3, & h4, & h5, & h6": { fontSize: "16px" },
  "& ul, & ol": { margin: "12px 0", paddingLeft: "24px" },
  "& li": { margin: "5px 0" },
  "& li > p": { margin: 0 },
  "& li > input": { marginRight: "8px" },
  "& :not(pre) > code": {
    padding: "2px 5px",
    borderRadius: "5px",
    background: t.muted,
    fontSize: "0.875em",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  '& [data-slot="code-block"]': { margin: "16px 0" },
  "& a": {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
  "& a:focus-visible, & [data-table-scroll]:focus-visible": {
    outline: `2px solid ${t.ring}`,
    outlineOffset: "2px",
  },
  "& blockquote": {
    margin: "16px 0",
    paddingLeft: "16px",
    borderLeft: `2px solid ${t.border}`,
    color: t.subtle,
  },
  "& hr": { margin: "24px 0", border: 0, borderTop: `1px solid ${t.border}` },
  "& [data-table-scroll]": {
    maxWidth: "100%",
    overflowX: "auto",
    margin: "16px 0",
  },
  "& table": { borderCollapse: "collapse", width: "100%", fontSize: "13px" },
  "& th, & td": {
    borderBottom: `1px solid ${t.border}`,
    padding: "10px 12px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  "& th": { fontWeight: 500, background: t.muted },
});

export function Markdown(handle: Handle<MarkdownProps>) {
  let previous: string | undefined;
  let children: RemixNode;
  return () => {
    const { content, mix, ...props } = handle.props;
    if (content !== previous) {
      children = renderTokens(marked.lexer(content, { gfm: true }));
      previous = content;
    }
    return (
      <div {...props} data-slot="markdown" mix={[markdownStyle, mix]}>
        {children}
      </div>
    );
  };
}
