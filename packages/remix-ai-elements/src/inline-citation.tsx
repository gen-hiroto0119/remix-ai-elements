import { css, type Handle } from "remix/component";
import { focusRing } from "./internal/parts.js";
import { PreviewPopover } from "./internal/popover.js";
import { type Source, sourceHost, sourceUrl } from "./internal/source.js";
import { tokens as t } from "./theme.js";
export interface InlineCitationProps {
  source: Source;
  label?: string;
}
export function InlineCitation(handle: Handle<InlineCitationProps>) {
  return () => {
    const { source, label = sourceHost(source.url) } = handle.props;
    return (
      <PreviewPopover hover label={label} ariaLabel={`Source: ${source.title}`}>
        <span
          mix={css({ display: "flex", flexDirection: "column", gap: "6px" })}
        >
          <strong>{source.title}</strong>
          {source.description ? (
            <span mix={css({ color: t.subtle })}>{source.description}</span>
          ) : null}
          <a
            href={sourceUrl(source.url)}
            target="_blank"
            rel="noreferrer"
            mix={[css({ color: t.subtle }), focusRing]}
          >
            {sourceHost(source.url)} ↗ <span>(opens in a new tab)</span>
          </a>
        </span>
      </PreviewPopover>
    );
  };
}
