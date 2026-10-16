import { Markdown } from "remix-ai-elements/markdown";
import { japanese, markdownSample } from "../../../../../shared/fixtures.ts";
import { Example } from "../shared/preview-primitives.tsx";
import { previewStyles } from "../shared/preview-styles.ts";

export function MarkdownPreview() {
  return () => (
    <div mix={previewStyles.sample}>
      <Markdown content={markdownSample} />
      <Example label="Japanese text">
        <Markdown content={japanese} />
      </Example>
    </div>
  );
}
