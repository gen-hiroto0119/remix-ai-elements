import type { Handle } from "remix/component";
import { TestResults } from "remix-ai-elements/test-results";
import type { CatalogState } from "../../shared/catalog-data.js";

export function TestResultsPreview(handle: Handle<{ state: CatalogState }>) {
  return () => (
    <TestResults
      key={handle.props.state}
      status={
        handle.props.state === "empty"
          ? "pending"
          : handle.props.state === "running"
            ? "running"
            : "complete"
      }
      command="pnpm test"
      suites={
        handle.props.state === "empty"
          ? []
          : [
              {
                id: "theme",
                name: "theme.test.ts",
                tests: [
                  {
                    id: "light",
                    name: "renders the light theme",
                    status: "passed",
                    duration: "2ms",
                  },
                  {
                    id: "dark",
                    name: "renders the dark theme",
                    status:
                      handle.props.state === "error" ? "failed" : "passed",
                    duration: "4ms",
                    error:
                      "Expected background: #171717\nReceived background: #ffffff",
                  },
                  {
                    id: "system",
                    name: "follows the OS preference",
                    status: "skipped",
                  },
                ],
              },
            ]
      }
    />
  );
}
