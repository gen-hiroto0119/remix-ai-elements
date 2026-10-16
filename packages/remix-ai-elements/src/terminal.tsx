import type { Handle } from "remix/component";
import { CodeBlock } from "./code-block.js";
import { Activity, type ActivityProps } from "./internal/activity.js";
import type { DistributiveOmit } from "./trace.js";
export type TerminalProps = DistributiveOmit<
  ActivityProps,
  "title" | "children"
> & { command: string; output: string; exitCode?: number; title?: string };
export function Terminal(handle: Handle<TerminalProps>) {
  return () => {
    const {
      command,
      output,
      exitCode,
      status = exitCode !== undefined && exitCode !== 0 ? "error" : "success",
      title = status === "running"
        ? `Running ${command}`
        : status === "error"
          ? `${command} failed${exitCode !== undefined ? ` (exit ${exitCode})` : ""}`
          : `Ran ${command}`,
      ...props
    } = handle.props;
    return (
      <Activity {...props} title={title} status={status}>
        <CodeBlock code={output} language="text" wrap />
      </Activity>
    );
  };
}
