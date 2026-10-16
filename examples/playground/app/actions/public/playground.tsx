import { clientEntry, type Handle } from "remix/component";
import { App } from "../../ui/public/app.tsx";

export const Playground = clientEntry(
  import.meta.url,
  function Playground(handle: Handle<{ localReference: boolean }>) {
    return () => <App localReference={handle.props.localReference} />;
  },
);
