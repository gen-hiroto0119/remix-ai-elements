import type { Handle } from "remix/component";
import type { CatalogPage } from "./data/catalog.js";
import { ChainOfThoughtPreview } from "./previews/catalog/chain-of-thought-preview.js";
import { CheckpointPreview } from "./previews/catalog/checkpoint-preview.js";
import { ConfirmationPreview } from "./previews/catalog/confirmation-preview.js";
import { ContextPreview } from "./previews/catalog/context-preview.js";
import { FileTreePreview } from "./previews/catalog/file-tree-preview.js";
import { InlineCitationPreview } from "./previews/catalog/inline-citation-preview.js";
import { ModelSelectorPreview } from "./previews/catalog/model-selector-preview.js";
import { PlanPreview } from "./previews/catalog/plan-preview.js";
import { QueuePreview } from "./previews/catalog/queue-preview.js";
import { SourcesPreview } from "./previews/catalog/sources-preview.js";
import { StackTracePreview } from "./previews/catalog/stack-trace-preview.js";
import { SubagentPreview } from "./previews/catalog/subagent-preview.js";
import { SuggestionPreview } from "./previews/catalog/suggestion-preview.js";
import { TaskPreview } from "./previews/catalog/task-preview.js";
import { TerminalPreview } from "./previews/catalog/terminal-preview.js";
import { TestResultsPreview } from "./previews/catalog/test-results-preview.js";
import {
  type CatalogState,
  catalogStatus,
  catalogSteps,
  progressPages,
} from "./shared/catalog-data.js";
import { CatalogPreviewContainer } from "./shared/catalog-preview.js";

export { Introduction } from "./components/introduction.js";
export type { CatalogPage } from "./data/catalog.js";
export {
  catalogDescriptions,
  isCatalogPage,
  officialPatterns,
  officialUrl,
} from "./data/catalog.js";

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
