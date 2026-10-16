import type { Handle } from "remix/component";
import { Navigation } from "./components/navigation.js";
import { PlaygroundContent } from "./components/playground-content.js";
import { PlaygroundShell } from "./components/playground-shell.js";
import type { Page } from "./data/pages.js";

export function App(handle: Handle) {
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
      <PlaygroundContent page={page} dark={dark} onNavigate={navigate} />
    </PlaygroundShell>
  );
}
