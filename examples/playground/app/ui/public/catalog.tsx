import type { Handle } from "remix/component";
import type { CatalogPage } from "./data/catalog.ts";
import { ChainOfThoughtPreview } from "./previews/catalog/chain-of-thought-preview.tsx";
import { CheckpointPreview } from "./previews/catalog/checkpoint-preview.tsx";
import { ConfirmationPreview } from "./previews/catalog/confirmation-preview.tsx";
import { ContextPreview } from "./previews/catalog/context-preview.tsx";
import { FileTreePreview } from "./previews/catalog/file-tree-preview.tsx";
import { InlineCitationPreview } from "./previews/catalog/inline-citation-preview.tsx";
import { ModelSelectorPreview } from "./previews/catalog/model-selector-preview.tsx";
import { PlanPreview } from "./previews/catalog/plan-preview.tsx";
import { QueuePreview } from "./previews/catalog/queue-preview.tsx";
import { SourcesPreview } from "./previews/catalog/sources-preview.tsx";
import { StackTracePreview } from "./previews/catalog/stack-trace-preview.tsx";
import { SubagentPreview } from "./previews/catalog/subagent-preview.tsx";
import { SuggestionPreview } from "./previews/catalog/suggestion-preview.tsx";
import { TaskPreview } from "./previews/catalog/task-preview.tsx";
import { TerminalPreview } from "./previews/catalog/terminal-preview.tsx";
import { TestResultsPreview } from "./previews/catalog/test-results-preview.tsx";
import {
  type CatalogState,
  catalogStatus,
  catalogSteps,
  progressPages,
} from "./shared/catalog-data.tsx";
import { CatalogPreviewContainer } from "./shared/catalog-preview.tsx";

export { Introduction } from "./components/introduction.tsx";
export type { CatalogPage } from "./data/catalog.ts";
export {
  catalogDescriptions,
  isCatalogPage,
  officialPatterns,
  officialUrl,
} from "./data/catalog.ts";

export function CatalogPreview(handle: Handle<{ page: CatalogPage }>) {
  let state: CatalogState = "complete";
  const updateState = (nextState: CatalogState) => {
    state = nextState;
    void handle.update();
  };

  return () => {
    const page = handle.props.page;
    const status = catalogStatus(state);
    const steps = catalogSteps(state);
    const preview = (() => {
      switch (page) {
        case "Chain of Thought":
          return (
            <ChainOfThoughtPreview
              state={state}
              steps={steps}
              status={status}
            />
          );
        case "Checkpoint":
          return <CheckpointPreview />;
        case "Confirmation":
          return <ConfirmationPreview />;
        case "Context":
          return <ContextPreview />;
        case "File Tree":
          return <FileTreePreview />;
        case "Inline Citation":
          return <InlineCitationPreview />;
        case "Model Selector":
          return <ModelSelectorPreview />;
        case "Plan":
          return <PlanPreview state={state} steps={steps} status={status} />;
        case "Queue":
          return <QueuePreview steps={steps} />;
        case "Sources":
          return <SourcesPreview />;
        case "Stack Trace":
          return <StackTracePreview />;
        case "Subagent":
          return (
            <SubagentPreview state={state} steps={steps} status={status} />
          );
        case "Suggestion":
          return <SuggestionPreview />;
        case "Task":
          return <TaskPreview state={state} steps={steps} status={status} />;
        case "Terminal":
          return <TerminalPreview state={state} status={status} />;
        case "Test Results":
          return <TestResultsPreview state={state} />;
        default:
          return null;
      }
    })();

    return (
      <CatalogPreviewContainer
        state={state}
        showState={progressPages.includes(page)}
        onStateChange={updateState}
      >
        {preview}
      </CatalogPreviewContainer>
    );
  };
}
