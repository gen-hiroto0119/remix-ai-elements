import { Reasoning } from "remix-ai-elements/reasoning";
import { reasoning } from "../../../../../shared/fixtures.ts";
import { Example } from "../shared/preview-primitives.tsx";
import { previewStyles } from "../shared/preview-styles.ts";

export function ReasoningPreview() {
  return () => (
    <div mix={previewStyles.sample}>
      <Example label="Completed · collapsed">
        <Reasoning duration={5}>{reasoning}</Reasoning>
      </Example>
      <Example label="Completed · expanded">
        <Reasoning duration={5} defaultOpen>
          {reasoning}
        </Reasoning>
      </Example>
      <Example label="Thinking · static state">
        <Reasoning status="thinking" defaultOpen>
          {reasoning}
        </Reasoning>
      </Example>
    </div>
  );
}
