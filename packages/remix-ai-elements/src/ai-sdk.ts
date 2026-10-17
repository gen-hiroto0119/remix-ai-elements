import {
  AbstractChat,
  type ChatInit,
  type ChatState,
  type ChatStatus,
  type UIMessage,
} from "ai";
import type { Handle } from "remix/component";

export { DefaultChatTransport } from "ai";

class ObservableChatState<MESSAGE extends UIMessage>
  implements ChatState<MESSAGE>
{
  #status: ChatStatus = "ready";
  #error: Error | undefined;
  #messages: MESSAGE[];

  constructor(
    messages: MESSAGE[],
    private notify: () => void,
  ) {
    this.#messages = structuredClone(messages);
  }

  get status() {
    return this.#status;
  }
  set status(value: ChatStatus) {
    this.#status = value;
    this.notify();
  }
  get error() {
    return this.#error;
  }
  set error(value: Error | undefined) {
    this.#error = value;
    this.notify();
  }
  get messages() {
    return this.#messages;
  }
  set messages(value: MESSAGE[]) {
    this.#messages = [...value];
    this.notify();
  }
  pushMessage = (message: MESSAGE) => {
    this.messages = [...this.#messages, structuredClone(message)];
  };
  popMessage = () => {
    this.messages = this.#messages.slice(0, -1);
  };
  replaceMessage = (index: number, message: MESSAGE) => {
    this.messages = this.#messages.with(index, structuredClone(message));
  };
  snapshot = <T>(value: T): T => structuredClone(value);
}

/** Framework-neutral chat state, with explicit subscriptions. */
export class Chat<
  MESSAGE extends UIMessage = UIMessage,
> extends AbstractChat<MESSAGE> {
  #listeners: Set<() => void>;

  constructor({ messages = [], ...options }: ChatInit<MESSAGE> = {}) {
    const listeners = new Set<() => void>();
    super({
      ...options,
      state: new ObservableChatState(messages, () => {
        for (const listener of listeners) listener();
      }),
    });
    this.#listeners = listeners;
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }
}

/** Create once in component setup. The component owns this chat's lifetime. */
export function createChat<MESSAGE extends UIMessage = UIMessage>(
  handle: Pick<Handle, "update" | "signal">,
  options: ChatInit<MESSAGE> = {},
): Chat<MESSAGE> {
  const chat = new Chat(options);
  const unsubscribe = chat.subscribe(() => {
    if (!handle.signal.aborted) void handle.update();
  });
  const dispose = () => {
    unsubscribe();
    void chat.dispose();
  };
  if (handle.signal.aborted) dispose();
  else handle.signal.addEventListener("abort", dispose, { once: true });
  return chat;
}
