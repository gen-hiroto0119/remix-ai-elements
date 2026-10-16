import { Tool } from "remix-ai-elements/tool";
import { command, output } from "../../../shared/fixtures.js";
import { Example } from "../shared/preview-primitives.js";
import { previewStyles } from "../shared/preview-styles.js";

export function ToolPreview() {
  return () => (
    <div mix={previewStyles.sample}>
      {(["pending", "running", "success", "error"] as const).map((status) => (
        <Example key={status} label={status}>
          <Tool
            name={
              status === "success"
                ? "Read appearance settings"
                : "Search the project"
            }
            status={status}
            defaultOpen={status === "success" || status === "error"}
            input={JSON.stringify({ command }, null, 2)}
            output={
              status === "error"
                ? "Permission denied. Check workspace access."
                : status === "success"
                  ? output
                  : undefined
            }
          />
        </Example>
      ))}
    </div>
  );
}
