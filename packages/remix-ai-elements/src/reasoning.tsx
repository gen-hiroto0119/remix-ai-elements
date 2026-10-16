import type { Handle } from "remix/component";
import {
  type DistributiveOmit,
  TraceDisclosure,
  type TraceDisclosureProps,
  TraceLine,
  TraceTitle,
} from "./trace.js";

export type ReasoningProps = DistributiveOmit<TraceDisclosureProps, "title"> & {
  status?: "thinking" | "complete";
  duration?: number;
  label?: string;
};

export function Reasoning(handle: Handle<ReasoningProps>) {
  return () => {
    const { status = "complete", duration, label, ...props } = handle.props;
    return (
      <TraceDisclosure
        {...props}
        title={
          <TraceLine status={status === "thinking" ? "running" : "success"}>
            <TraceTitle>
              {label ||
                (status === "thinking"
                  ? "Thinking…"
                  : duration === undefined
                    ? "Reasoning"
                    : `Thought for ${duration}s`)}
            </TraceTitle>
          </TraceLine>
        }
      />
    );
  };
}
