import type { Handle } from "remix/component";
import { CodeBlock } from "./code-block.js";
import { Activity, ActivitySteps } from "./internal/activity.js";
import { Trace } from "./trace.js";
export interface TestResult {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped";
  error?: string;
  duration?: string;
}
export interface TestSuite {
  id: string;
  name: string;
  tests: readonly TestResult[];
}
export interface TestResultsProps {
  suites: readonly TestSuite[];
  status?: "running" | "complete";
  command?: string;
}
function counts(tests: readonly TestResult[]) {
  const failed = tests.filter((test) => test.status === "failed").length;
  const skipped = tests.filter((test) => test.status === "skipped").length;
  return {
    failed,
    label: `${tests.length} tests${failed ? `, ${failed} failed` : ""}${skipped ? `, ${skipped} skipped` : ""}`,
  };
}
export function TestResults(handle: Handle<TestResultsProps>) {
  return () => {
    const { suites, status = "complete", command = "tests" } = handle.props;
    const total = counts(suites.flatMap((suite) => [...suite.tests]));
    return (
      <Activity
        key={status}
        title={
          status === "running" ? `Running ${command}` : `Ran ${total.label}`
        }
        status={
          status === "running" ? "running" : total.failed ? "error" : "success"
        }
        defaultOpen={total.failed > 0}
      >
        <Trace>
          {suites.map((suite) => {
            const summary = counts(suite.tests);
            return (
              <Activity
                key={suite.id}
                title={suite.name}
                description={summary.label}
                status={summary.failed ? "error" : "success"}
                defaultOpen={summary.failed > 0}
              >
                <ActivitySteps
                  steps={suite.tests.map((test) => ({
                    id: test.id,
                    title:
                      test.status === "skipped"
                        ? `Skipped ${test.name}`
                        : test.name,
                    status:
                      test.status === "failed"
                        ? "error"
                        : test.status === "skipped"
                          ? "pending"
                          : "success",
                    description: test.duration,
                    content:
                      test.status === "failed" ? (
                        <CodeBlock
                          code={test.error ?? "Test failed"}
                          language="text"
                          wrap
                        />
                      ) : undefined,
                  }))}
                />
              </Activity>
            );
          })}
        </Trace>
      </Activity>
    );
  };
}
