import type { Handle } from "remix/component";
import { Activity, type ActivityProps } from "./internal/activity.js";
export type SubagentProps = ActivityProps & { report?: string };
export function Subagent(handle: Handle<SubagentProps>) {
  return () => {
    const { report, children, ...props } = handle.props;
    return (
      <Activity {...props}>
        {children}
        {report ? <p>{report}</p> : null}
      </Activity>
    );
  };
}
