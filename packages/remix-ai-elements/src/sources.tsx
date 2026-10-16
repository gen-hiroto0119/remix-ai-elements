import { css, type Handle } from "remix/component";
import { Activity } from "./internal/activity.js";
import { focusRing } from "./internal/parts.js";
import { type Source, sourceUrl } from "./internal/source.js";
import { Trace } from "./trace.js";

export type { Source } from "./internal/source.js";
export interface SourcesProps {
  sources: readonly Source[];
  defaultOpen?: boolean;
  title?: string;
}
export function Sources(handle: Handle<SourcesProps>) {
  return () => {
    const {
      sources,
      defaultOpen,
      title = `Used ${sources.length} sources`,
    } = handle.props;
    return (
      <Activity title={title} defaultOpen={defaultOpen}>
        <Trace>
          {sources.map((source) => (
            <a
              key={source.id}
              href={sourceUrl(source.url)}
              target="_blank"
              rel="noreferrer"
              mix={[
                css({
                  color: "inherit",
                  textDecoration: "none",
                  overflowWrap: "anywhere",
                  "&:hover": { textDecoration: "underline" },
                }),
                focusRing,
              ]}
            >
              {source.title} <span aria-label="opens in a new tab">↗</span>
            </a>
          ))}
        </Trace>
      </Activity>
    );
  };
}
