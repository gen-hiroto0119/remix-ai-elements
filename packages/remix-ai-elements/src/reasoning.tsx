import type { Handle } from 'remix/component';
import { TraceDisclosure, TraceLine, TraceTitle, type TraceDisclosureProps } from './trace.js';

export type ReasoningProps = Omit<TraceDisclosureProps, 'title'> & {
  status?: 'thinking' | 'complete';
  duration?: number;
  label?: string;
};

export function Reasoning(handle: Handle<ReasoningProps>) {
  return () => {
    const { status = 'complete', duration, label, ...props } = handle.props;
    return <TraceDisclosure {...props} title={<TraceLine status={status === 'thinking' ? 'running' : 'success'}><TraceTitle>{label || (status === 'thinking' ? 'Thinking…' : duration === undefined ? 'Reasoning' : `Thought for ${duration}s`)}</TraceTitle></TraceDisclosure>;
  };
}
