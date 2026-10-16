import { css } from "remix/component";
import { Markdown } from "remix-ai-elements/markdown";
import {
  Message,
  MessageBubble,
  MessageContent,
  MessageHeader,
} from "remix-ai-elements/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
} from "remix-ai-elements/message-scroller";
import { japanese, question } from "../../../../../shared/fixtures.ts";
import { previewStyles } from "../shared/preview-styles.ts";

export function MessageScrollerPreview() {
  return () => (
    <>
      <div mix={previewStyles.chatHeader}>
        <div>
          <h2 mix={previewStyles.chatTitle}>A longer conversation</h2>
          <p mix={previewStyles.chatDescription}>
            Scroll freely, or jump to the latest message.
          </p>
        </div>
        <MessageScrollerButton targetId="scroll-demo" />
      </div>
      <MessageScroller id="scroll-demo" mix={css({ height: "420px" })}>
        <MessageScrollerContent>
          {Array.from({ length: 12 }, (_, index) => (
            <Message key={index} from={index % 2 === 0 ? "user" : "assistant"}>
              <MessageContent>
                {index % 2 === 0 ? (
                  <MessageBubble>
                    Message {index + 1} — {question}
                  </MessageBubble>
                ) : (
                  <>
                    <MessageHeader>Remix assistant · {index + 1}</MessageHeader>
                    <Markdown content={japanese} />
                  </>
                )}
              </MessageContent>
            </Message>
          ))}
        </MessageScrollerContent>
      </MessageScroller>
    </>
  );
}
