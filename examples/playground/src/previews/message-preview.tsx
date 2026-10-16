import { CodeBlockCopyButton } from "remix-ai-elements/code-block";
import { Markdown } from "remix-ai-elements/markdown";
import {
  Message,
  MessageActions,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageHeader,
} from "remix-ai-elements/message";
import { japanese, question } from "../../../shared/fixtures.js";
import { Example } from "../shared/preview-primitives.js";
import { previewStyles } from "../shared/preview-styles.js";

export function MessagePreview() {
  return () => (
    <div mix={previewStyles.sample}>
      <Example label="A conversation">
        <div mix={previewStyles.sampleGroup}>
          <Message from="user">
            <MessageContent>
              <MessageBubble>{question}</MessageBubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageContent>
              <MessageHeader>Remix assistant</MessageHeader>
              <Markdown content="I’ll add **Light**, **Dark**, and **System** options, with an accessible toggle and a sensible default." />
              <MessageActions>
                <CodeBlockCopyButton
                  value="I’ll add Light, Dark, and System options."
                  label="Copy message"
                />
              </MessageActions>
            </MessageContent>
          </Message>
        </div>
      </Example>
      <Example label="With an avatar">
        <Message>
          <MessageAvatar>R</MessageAvatar>
          <MessageContent>
            <MessageBubble variant="outline">{japanese}</MessageBubble>
          </MessageContent>
        </Message>
      </Example>
      <Example label="Long content">
        <Message from="user">
          <MessageContent>
            <MessageBubble>
              Long identifiers stay inside the message:
              remix_ai_elements_visual_preview_component_with_a_deliberately_long_identifier_to_check_wrapping
            </MessageBubble>
          </MessageContent>
        </Message>
      </Example>
    </div>
  );
}
