import { css, type Handle } from "remix/component";
import { CodeBlock } from "./code-block.js";
import { Activity, ActivitySteps } from "./internal/activity.js";
import { Trace } from "./trace.js";
export interface StackTraceProps {
  stack: string;
  defaultOpen?: boolean;
}
export function StackTrace(handle: Handle<StackTraceProps>) {
  return () => {
    const { stack, defaultOpen = true } = handle.props;
    const [error = "Error", ...lines] = stack
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const internal = lines.filter(
      (line) => line.includes("node_modules") || line.includes("node:"),
    );
    const app = lines.filter((line) => !internal.includes(line));
    return (
      <Activity
        title={`Failed: ${error}`}
        status="error"
        defaultOpen={defaultOpen}
      >
        <Trace>
          <p
            mix={css({
              margin: 0,
              fontFamily: "monospace",
              overflowWrap: "anywhere",
            })}
          >
            {error}
          </p>
          <ActivitySteps
            steps={app.map((line, index) => ({
              id: String(index),
              title: line,
              status: "error",
            }))}
          />
          {internal.length ? (
            <Activity title={`${internal.length} framework frames`}>
              <CodeBlock code={internal.join("\n")} language="text" wrap />
            </Activity>
          ) : null}
        </Trace>
      </Activity>
    );
  };
}
