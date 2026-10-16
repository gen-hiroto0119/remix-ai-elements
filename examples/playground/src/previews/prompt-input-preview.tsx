import type { PromptStatus } from "remix-ai-elements/prompt-input";
import {
  Example,
  PromptDemo,
  previewTextStyles,
} from "../shared/preview-primitives.js";
import { previewStyles } from "../shared/preview-styles.js";

export function PromptInputPreview() {
  return () => (
    <div mix={previewStyles.sample}>
      {(["ready", "submitted", "streaming", "error"] as const).map(
        (status: PromptStatus) => (
          <Example key={status} label={status}>
            <PromptDemo status={status} label={`${status} message`} />
            {status === "error" ? (
              <p mix={previewTextStyles.error}>
                Unable to send. This is a visual example.
              </p>
            ) : null}
          </Example>
        ),
      )}
    </div>
  );
}
