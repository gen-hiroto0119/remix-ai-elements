import type { Handle } from "remix/component";
import type { ChainOfThoughtStep } from "remix-ai-elements/chain-of-thought";
import { Queue } from "remix-ai-elements/queue";

export function QueuePreview(handle: Handle<{ steps: ChainOfThoughtStep[] }>) {
  return () => <Queue items={handle.props.steps} />;
}
