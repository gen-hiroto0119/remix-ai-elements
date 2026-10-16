import type { Handle } from "remix/component";
import {
  Activity,
  type ActivityStep,
  ActivitySteps,
} from "./internal/activity.js";
import { Trace } from "./trace.js";
export interface QueueProps {
  items: readonly ActivityStep[];
  emptyLabel?: string;
}
export function Queue(handle: Handle<QueueProps>) {
  return () => {
    const { items, emptyLabel = "No queued tasks" } = handle.props;
    const pending = items.filter((item) => item.status !== "success");
    const completed = items.filter((item) => item.status === "success");
    return (
      <Trace data-slot="queue">
        {!items.length ? <span>{emptyLabel}</span> : null}
        {pending.length ? (
          <Activity key="pending" title={`${pending.length} to do`} defaultOpen>
            <ActivitySteps steps={pending} />
          </Activity>
        ) : null}
        {completed.length ? (
          <Activity
            key="completed"
            title={`${completed.length} completed`}
            defaultOpen
          >
            <ActivitySteps steps={completed} />
          </Activity>
        ) : null}
      </Trace>
    );
  };
}
