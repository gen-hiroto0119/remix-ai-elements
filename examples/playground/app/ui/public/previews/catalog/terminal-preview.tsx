import type { Handle } from "remix/component";
import { Terminal } from "remix-ai-elements/terminal";
import type {
  CatalogState,
  CatalogStatus,
} from "../../shared/catalog-data.tsx";

export function TerminalPreview(
  handle: Handle<{ state: CatalogState; status: CatalogStatus }>,
) {
  return () => (
    <Terminal
      key={handle.props.state}
      command="pnpm build"
      status={handle.props.status}
      exitCode={
        handle.props.state === "error"
          ? 1
          : handle.props.state === "complete"
            ? 0
            : undefined
      }
      output={
        handle.props.state === "empty"
          ? "No output yet."
          : handle.props.state === "error"
            ? "error TS2307: Cannot find module './theme'.\nBuild failed with exit code 1."
            : handle.props.state === "running"
              ? "Building production bundle…\nTransforming modules…"
              : "✓ 42 modules transformed.\ndist/index.js  18.4 kB\nBuild completed in 1.2s."
      }
      defaultOpen
    />
  );
}
