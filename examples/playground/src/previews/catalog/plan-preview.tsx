import type { Handle } from "remix/component";
import type { ChainOfThoughtStep } from "remix-ai-elements/chain-of-thought";
import { Plan } from "remix-ai-elements/plan";
import type { CatalogState, CatalogStatus } from "../../shared/catalog-data.js";

export function PlanPreview(
  handle: Handle<{
    state: CatalogState;
    steps: ChainOfThoughtStep[];
    status: CatalogStatus;
  }>,
) {
  return () => (
    <Plan
      key={handle.props.state}
      title="Plan: add an appearance setting"
      steps={handle.props.steps}
      status={handle.props.status}
    />
  );
}
