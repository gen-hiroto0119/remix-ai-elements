import type { Handle } from "remix/component";
import {
  ChainOfThought,
  type ChainOfThoughtStep,
} from "remix-ai-elements/chain-of-thought";
import { CodeBlock } from "remix-ai-elements/code-block";
import { Sources } from "remix-ai-elements/sources";
import {
  type CatalogState,
  type CatalogStatus,
  sources,
} from "../../shared/catalog-data.tsx";

export function ChainOfThoughtPreview(
  handle: Handle<{
    state: CatalogState;
    steps: ChainOfThoughtStep[];
    status: CatalogStatus;
  }>,
) {
  return () => {
    const { state, steps, status } = handle.props;
    return (
      <ChainOfThought
        key={state}
        steps={steps.map((step, i) => ({
          ...step,
          title:
            [
              "Read the build log",
              "Search the documentation",
              "Inspect the image cache",
            ][i] ?? step.title,
          content:
            step.content ??
            (i === 0 ? (
              <CodeBlock
                code={"install    41s\ncompile    38s\nimages     3m 52s"}
                language="text"
              />
            ) : i === 1 ? (
              <Sources sources={sources} defaultOpen />
            ) : (
              <CodeBlock
                code={"const cacheKey = process.env.COMMIT_SHA"}
                language="ts"
              />
            )),
        }))}
        status={status}
        defaultOpen
        title={
          state === "running"
            ? "Researching"
            : state === "empty"
              ? "No research steps yet"
              : state === "error"
                ? "Research stopped · 1 failed step"
                : "Researched in 3 steps"
        }
      />
    );
  };
}
