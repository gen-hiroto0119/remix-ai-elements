import { type Handle, on } from "remix/component";
import { Confirmation } from "remix-ai-elements/confirmation";
import { ActionButton } from "../../../../../packages/remix-ai-elements/src/internal/parts.js";

export function ConfirmationPreview(handle: Handle) {
  let decision: "pending" | "approved" | "denied" = "pending";
  const update = () => {
    void handle.update();
  };

  return () => (
    <>
      <Confirmation
        title="Remove the build output?"
        description="This action would remove the dist folder. This preview never executes commands."
        state={decision}
        onDecision={(approved) => {
          decision = approved ? "approved" : "denied";
          update();
        }}
      />
      <ActionButton
        mix={on("click", () => {
          decision = "pending";
          update();
        })}
      >
        Reset preview
      </ActionButton>
    </>
  );
}
