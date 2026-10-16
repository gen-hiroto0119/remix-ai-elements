import { CodeBlock } from "remix-ai-elements/code-block";
import { code } from "../../../../../shared/fixtures.ts";
import { Example } from "../shared/preview-primitives.tsx";
import { previewStyles } from "../shared/preview-styles.ts";

export function CodeBlockPreview() {
  return () => (
    <div mix={previewStyles.sample}>
      <Example label="With a filename">
        <CodeBlock code={code} language="tsx" filename="appearance.tsx" />
      </Example>
      <Example label="Line numbers">
        <CodeBlock
          code={
            'const theme = darkTheme;\nconst message = "Hello, Remix.";\n\n// Small, composable pieces.'
          }
          language="ts"
          lineNumbers
        />
      </Example>
      <Example label="Wrapped output">
        <CodeBlock
          code={
            "GET /api/example?conversation=remix-ai-elements-visual-preview-with-a-deliberately-long-query-string-to-demonstrate-wrapping-without-horizontal-page-overflow"
          }
          wrap
        />
      </Example>
    </div>
  );
}
