import { Reasoning } from "remix-ai-elements/reasoning";
import { Tool } from "remix-ai-elements/tool";
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "remix-ai-elements/trace";
import { Icon } from "../../../../../../packages/remix-ai-elements/dist/internal/icon.js";
import { command, output, reasoning } from "../../../../../shared/fixtures.ts";
import { Example } from "../shared/preview-primitives.tsx";
import { previewStyles } from "../shared/preview-styles.ts";

export function TracePreview() {
  return () => (
    <div mix={previewStyles.sample}>
      <Example label="A few small steps">
        <Trace>
          <TraceLine status="success">
            <TraceIcon>
              <Icon name="check" />
            </TraceIcon>
            <TraceTitle>Read the request</TraceTitle>
            <TraceDescription>0.2s</TraceDescription>
          </TraceLine>
          <Reasoning duration={5}>{reasoning}</Reasoning>
          <Tool
            name="Search the project"
            input={JSON.stringify({ command }, null, 2)}
            output={output}
          />
          <TraceLine status="running">
            <TraceIcon>
              <Icon name="clock" />
            </TraceIcon>
            <TraceTitle>Preparing a response…</TraceTitle>
          </TraceLine>
          <TraceLine status="pending">
            <TraceIcon>
              <Icon name="code" />
            </TraceIcon>
            <TraceTitle>Review the changes · Pending</TraceTitle>
          </TraceLine>
        </Trace>
      </Example>
    </div>
  );
}
