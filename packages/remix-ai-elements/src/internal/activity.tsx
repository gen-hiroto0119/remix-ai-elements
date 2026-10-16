import { css, type Handle, type RemixNode } from "remix/component";
import {
  type DistributiveOmit,
  Trace,
  TraceDescription,
  TraceDisclosure,
  type TraceDisclosureProps,
  TraceLine,
  type TraceStatus,
  TraceTitle,
} from "../trace.js";
import { Icon } from "./icon.js";

export type ActivityProps = DistributiveOmit<TraceDisclosureProps, "title"> & {
  title: string;
  status?: TraceStatus;
  description?: string;
};
export interface ActivityStep {
  id: string;
  title: string;
  status: TraceStatus;
  description?: string;
  content?: RemixNode;
}
export function StatusIcon(handle: Handle<{ status?: TraceStatus }>) {
  return () => (
    <Icon
      name={
        handle.props.status === "error"
          ? "alert"
          : handle.props.status === "running"
            ? "clock"
            : handle.props.status === "pending"
              ? "circle"
              : "check"
      }
    />
  );
}
export function Activity(handle: Handle<ActivityProps>) {
  return () => {
    const { title, status = "success", description, ...props } = handle.props;
    return (
      <TraceDisclosure
        {...props}
        title={
          <TraceLine status={status}>
            <StatusIcon status={status} />
            <span
              mix={css({
                minWidth: 0,
                display: "flex",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: "4px 8px",
              })}
            >
              <TraceTitle>{title}</TraceTitle>
              {description ? (
                <TraceDescription>{description}</TraceDescription>
              ) : null}
            </span>
          </TraceLine>
        }
      />
    );
  };
}
export function ActivitySteps(
  handle: Handle<{ steps: readonly ActivityStep[] }>,
) {
  return () => (
    <Trace>
      {handle.props.steps.map((step) =>
        step.content != null ? (
          <Activity
            key={step.id}
            title={step.title}
            status={step.status}
            description={step.description}
            defaultOpen={step.status === "error"}
          >
            {step.content}
          </Activity>
        ) : (
          <TraceLine
            key={step.id}
            status={step.status}
            mix={css({ flexWrap: "wrap" })}
          >
            <StatusIcon status={step.status} />
            <TraceTitle>{step.title}</TraceTitle>
            {step.description ? (
              <TraceDescription>{step.description}</TraceDescription>
            ) : null}
          </TraceLine>
        ),
      )}
    </Trace>
  );
}
