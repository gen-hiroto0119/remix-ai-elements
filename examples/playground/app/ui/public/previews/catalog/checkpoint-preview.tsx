import { type Handle, on } from "remix/component";
import { Checkpoint } from "remix-ai-elements/checkpoint";
import { ActionButton } from "../../../../../../../packages/remix-ai-elements/dist/internal/parts.js";

export function CheckpointPreview(handle: Handle) {
  let restored = false;
  const update = () => {
    void handle.update();
  };

  return () => (
    <>
      <p>Renamed Button to Action in the component library.</p>
      <Checkpoint
        label="Button renamed"
        disabled={restored}
        onRestore={() => {
          restored = true;
          update();
        }}
      />
      {restored ? (
        <p role="status">
          Preview restored to “Button renamed”. No project files were changed.
        </p>
      ) : (
        <p>Updated the documentation to match the new name.</p>
      )}
      <ActionButton
        mix={on("click", () => {
          restored = false;
          update();
        })}
      >
        Reset preview
      </ActionButton>
    </>
  );
}
