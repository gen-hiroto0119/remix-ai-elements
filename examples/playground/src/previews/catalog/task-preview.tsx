import type { Handle } from "remix/component";
import type { ChainOfThoughtStep } from "remix-ai-elements/chain-of-thought";
import { Task } from "remix-ai-elements/task";
import type { CatalogState, CatalogStatus } from "../../shared/catalog-data.js";

export function TaskPreview(
  handle: Handle<{
    state: CatalogState;
    steps: ChainOfThoughtStep[];
    status: CatalogStatus;
  }>,
) {
  return () => (
    <Task
      key={handle.props.state}
      title={
        handle.props.state === "complete"
          ? "Added appearance settings"
          : handle.props.state === "empty"
            ? "No task steps yet"
            : "Update appearance settings"
      }
      status={handle.props.status}
      steps={handle.props.steps}
      defaultOpen
    />
  );
}
