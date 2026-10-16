import { ModelSelector } from "remix-ai-elements/model-selector";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "remix-ai-elements/prompt-input";

export function ModelSelectorPreview() {
  return () => (
    <PromptInput>
      <PromptInputTextarea
        aria-label="Model preview message"
        placeholder="Ask the agent to change your code…"
      />
      <PromptInputToolbar>
        <ModelSelector
          defaultValue="gpt-5"
          models={[
            { id: "gpt-5", name: "GPT-5", provider: "OpenAI" },
            {
              id: "gpt-5-mini",
              name: "GPT-5 mini",
              provider: "OpenAI",
            },
            {
              id: "sonnet",
              name: "Claude Sonnet 4.5",
              provider: "Anthropic",
            },
            {
              id: "haiku",
              name: "Claude Haiku 4.5",
              provider: "Anthropic",
            },
          ]}
        />
        <ModelSelector
          label="Effort"
          defaultValue="medium"
          models={["low", "medium", "high"].map((id) => ({
            id,
            name: id[0]!.toUpperCase() + id.slice(1),
            provider: "Reasoning effort",
          }))}
        />
        <PromptInputSubmit disabled title="Visual preview only" />
      </PromptInputToolbar>
    </PromptInput>
  );
}
