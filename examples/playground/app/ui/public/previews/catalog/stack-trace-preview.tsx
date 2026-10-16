import { StackTrace } from "remix-ai-elements/stack-trace";

export function StackTracePreview() {
  return () => (
    <StackTrace
      stack={
        "TypeError: Cannot read properties of undefined (reading 'theme')\n    at resolveTheme (app/settings.ts:42:12)\n    at renderSettings (app/routes/settings.ts:18:5)\n    at processRequest (node_modules/remix/server.js:91:3)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
      }
    />
  );
}
