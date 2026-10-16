import type { Handle } from "remix/component";
import {
  Activity,
  type ActivityProps,
  type ActivityStep,
  ActivitySteps,
} from "./internal/activity.js";
import type { DistributiveOmit } from "./trace.js";

export type { ActivityStep as ChainOfThoughtStep } from "./internal/activity.js";
export type ChainOfThoughtProps = DistributiveOmit<
  ActivityProps,
  "title" | "children"
> & { title?: string; steps: readonly ActivityStep[] };
export function ChainOfThought(handle: Handle<ChainOfThoughtProps>) {
  return () => {
    const {
      steps,
      title = `Researched in ${steps.length} steps`,
      ...props
    } = handle.props;
    return (
      <Activity {...props} title={title}>
        <ActivitySteps steps={steps} />
      </Activity>
    );
  };
}
