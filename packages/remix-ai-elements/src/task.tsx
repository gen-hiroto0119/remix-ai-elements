import type { Handle } from "remix/component";
import {
  Activity,
  type ActivityProps,
  type ActivityStep,
  ActivitySteps,
} from "./internal/activity.js";
export type TaskProps = ActivityProps & { steps: readonly ActivityStep[] };
export function Task(handle: Handle<TaskProps>) {
  return () => {
    const { steps, children, ...props } = handle.props;
    return (
      <Activity {...props}>
        <ActivitySteps steps={steps} />
        {children}
      </Activity>
    );
  };
}
