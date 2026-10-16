import { css, type Handle } from 'remix/component';
import { CodeBlock } from './code-block.js';
import { Icon } from './internal/icon.js';
import { TraceDisclosure, TraceIcon, TraceLine, TraceTitle, TraceDescription, type TraceDisclosureProps, type TraceStatus } from './trace.js';

export type ToolProps = Omit<TraceDisclosureProps, 'title' | 'children'> & {
  name: string;
  status?: TraceStatus;
  input?: string;
  output?: string;
  statusLabel?: string;
};
const labels: Record<TraceStatus, string> = { pending: 'Pending', running: 'Running', success: 'Completed', error: 'Failed' };
const stack = css({ display: 'flex', flexDirection: 'column', gap: '12px' });
const caption = css({ fontSize: '12px', margin: '0 0 6px', fontWeight: 500 });

export function Tool(handle: Handle<ToolProps>) {
  return () => {
    const { name, status = 'success', input, output, statusLabel, ...props } = handle.props;
    return <TraceDisclosure {...props} title={<TraceLine status={status}>
      <TraceIcon><Icon name={status === 'error' ? 'alert' : 'terminal'} /></TraceIcon>
      <TraceTitle>{name}</TraceTitle><TraceDescription>{statusLabel || labels[status]}</TraceDescription>
    </TraceLine>}><div mix={stack}>
      {input !== undefined ? <div><p mix={caption}>Input</p><CodeBlock code={input} language="json" wrap /></div> : null}
      {output !== undefined ? <div><p mix={caption}>{status === 'error' ? 'Error' : 'Output'}</p><CodeBlock code={output} variant={status === 'error' ? 'error' : 'default'} wrap /></div> : null}
      {input === undefined && output === undefined ? <span>No output yet.</span> : null}
    </div></TraceDisclosure>;
  };
}
