import type { Handle } from "remix/component";
import type { ChainOfThoughtStep } from "remix-ai-elements/chain-of-thought";
import { Subagent } from "remix-ai-elements/subagent";
import { Task } from "remix-ai-elements/task";
import { Terminal } from "remix-ai-elements/terminal";
import type { CatalogState, CatalogStatus } from "../../shared/catalog-data.js";

export function SubagentPreview(
  handle: Handle<{
    state: CatalogState;
    steps: ChainOfThoughtStep[];
    status: CatalogStatus;
  }>,
) {
  return () => {
    const { state, steps, status } = handle.props;
    return (
      <Subagent
        key={state}
        title={
          state === "running"
            ? "Running the research subagent"
            : state === "empty"
              ? "No delegated work yet"
              : "Research subagent"
        }
        status={status}
        defaultOpen
        report={
          state === "complete"
            ? "The cache key includes the commit SHA. Key the cache on the image directory instead."
            : undefined
        }
      >
        {state !== "empty" ? (
          <>
            <Terminal
              command="rg cacheKey scripts"
              output="scripts/optimize-images.ts:14: const cacheKey = process.env.COMMIT_SHA"
            />
            <Task
              title="Inspect the cache"
              steps={steps}
              status={status}
              defaultOpen
            />
          </>
        ) : null}
      </Subagent>
    );
  };
}
