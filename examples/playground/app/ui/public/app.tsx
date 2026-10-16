import type { Handle } from "remix/component";
import { Navigation } from "./components/navigation.tsx";
import { PlaygroundContent } from "./components/playground-content.tsx";
import { PlaygroundShell } from "./components/playground-shell.tsx";
import type { Page } from "./data/pages.ts";

export function App(handle: Handle<{ localReference?: boolean }>) {
  let page: Page = "Introduction";
  let dark = false;

  const navigate = (next: Page) => {
    page = next;
    void handle.update();
  };
  const toggleTheme = () => {
    dark = !dark;
    void handle.update();
  };

  return () => (
    <PlaygroundShell
      dark={dark}
      onToggleTheme={toggleTheme}
      navigation={<Navigation page={page} onNavigate={navigate} />}
    >
      <PlaygroundContent
        page={page}
        dark={dark}
        onNavigate={navigate}
        localReference={handle.props.localReference}
      />
    </PlaygroundShell>
  );
}
