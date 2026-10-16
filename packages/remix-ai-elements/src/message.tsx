import { css, type Handle, type Props } from 'remix/component';
import { divPart, ActionButton } from './internal/parts.js';
import { tokens as t } from './theme.js';

export type MessageProps = Props<'div'> & { from?: 'user' | 'assistant' | 'system'; align?: 'start' | 'end' };
const messageStyle = css({
  display: 'flex', position: 'relative', width: '100%', minWidth: 0, gap: '8px', fontSize: '14px', lineHeight: 1.625, color: t.foreground,
  '&[data-align="end"]': { flexDirection: 'row-reverse' },
  '&[data-align="end"] [data-slot="message-bubble"]': { alignSelf: 'flex-end' },
  '&[data-align="end"] [data-slot="message-actions"]': { justifyContent: 'flex-end' },
});

export function Message(handle: Handle<MessageProps>) {
  return () => {
    const { from = 'assistant', align = from === 'user' ? 'end' : 'start', mix, ...props } = handle.props;
    return <div {...props} data-slot="message" data-from={from} data-align={align} mix={[messageStyle, mix]} />;
  };
}

export const MessageGroup = divPart('message-group', css({ display: 'flex', flexDirection: 'column', minWidth: 0, gap: '8px' }));
export const MessageContent = divPart('message-content', css({ display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', gap: '10px', overflowWrap: 'anywhere' }));
export const MessageHeader = divPart('message-header', css({ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: t.subtle }));
export const MessageActions = divPart('message-actions', css({ display: 'flex', alignItems: 'center', gap: '2px', color: t.subtle }));
export const MessageAvatar = divPart('message-avatar', css({ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end', width: '32px', height: '32px', borderRadius: '50%', background: t.muted, fontSize: '12px' }));
export const MessageAction = ActionButton;

const bubbleStyle = css({
  maxWidth: '80%', width: 'fit-content', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '24px', border: '1px solid transparent', background: t.muted, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
  '&[data-variant="outline"]': { background: t.background, borderColor: t.border },
  '&[data-variant="ghost"]': { maxWidth: '100%', background: 'transparent', padding: 0, border: 0, borderRadius: 0 },
});
export function MessageBubble(handle: Handle<Props<'div'> & { variant?: 'muted' | 'outline' | 'ghost' }>) {
  return () => {
    const { variant = 'muted', mix, ...props } = handle.props;
    return <div {...props} data-slot="message-bubble" data-variant={variant} mix={[bubbleStyle, mix]} />;
  };
}
