import { type Handle, on } from "remix/component";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "remix-ai-elements/prompt-input";
import { Suggestion, Suggestions } from "remix-ai-elements/suggestion";

export function SuggestionPreview(handle: Handle) {
  let prompt = "";
  const update = () => {
    void handle.update();
  };

  return () => (
    <>
      <Suggestions>
        {[
          "Add a dark mode toggle",
          "Fix the failing build",
          "Write tests for the form",
          "Add a loading state",
          "日本語で説明してください",
        ].map((text) => (
          <Suggestion
            key={text}
            prompt={text}
            onSelect={(text) => {
              prompt = text;
              update();
            }}
          />
        ))}
      </Suggestions>
      <PromptInput>
        <PromptInputTextarea
          aria-label="Suggested prompt"
          placeholder="Choose a suggestion…"
          value={prompt}
          mix={on("input", (event) => {
            prompt = event.currentTarget.value;
          })}
        />
        <PromptInputToolbar>
          <span>Preview only</span>
          <PromptInputSubmit disabled />
        </PromptInputToolbar>
      </PromptInput>
    </>
  );
}
