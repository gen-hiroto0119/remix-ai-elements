import { Markdown } from "remix-ai-elements/markdown";
import { japanese, markdownSample } from "../../../shared/fixtures.js";
import { Example } from "../shared/preview-primitives.js";
import { previewStyles } from "../shared/preview-styles.js";

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
