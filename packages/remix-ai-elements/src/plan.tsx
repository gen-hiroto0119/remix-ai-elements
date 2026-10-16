import type { Handle } from "remix/component";
import {
  Activity,
  type ActivityProps,
  type ActivityStep,
  ActivitySteps,
} from "./internal/activity.js";
export type PlanProps = ActivityProps & { steps: readonly ActivityStep[] };
export function Plan(handle: Handle<PlanProps>) {
  return () => {
    const {
      steps,
      description = `${steps.filter((step) => step.status === "success").length} of ${steps.length} done`,
      children,
      ...props
    } = handle.props;
    return (
      <Activity defaultOpen {...props} description={description}>
        <ActivitySteps steps={steps} />
        {children}
      </Activity>
    );
  };
}
