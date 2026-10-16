export const question = 'Add a dark mode toggle to the settings page.';
export const reasoning = 'I’ll check how themes are set up, then add a small toggle that follows the system preference. The component should stay independent of the rest of the page.';
export const command = 'rg -n "theme" app/settings';
export const output = 'app/settings/appearance.tsx\napp/ui/theme.ts';
export const code = `import { css } from "remix/component";
import { darkTheme } from "remix-ai-elements/theme";

<section mix={[darkTheme, css({ padding: "24px" })]}>
  <Message from="assistant">
    <MessageContent>Hello, Remix.</MessageContent>
  </Message>
</section>`;
export const answer = `The appearance settings now have a **Light**, **Dark**, and **System** option. New visitors follow their OS preference.

### What changed

- Added a small, keyboard-accessible theme toggle.
- Kept the theme scoped to the conversation.
- Used Remix’s native \`css()\` and \`mix\` — no Tailwind required.

\`\`\`tsx
${code}
\`\`\`

The same components work in both themes, without changing the markup.`;
export const markdownSample = `## A little structure goes a long way

Messages can include **strong text**, *emphasis*, ~~revisions~~, and [links to the Remix docs](https://remix.run/docs).

> Keep the UI small. Let the application own the data.

1. Import a component.
2. Compose your conversation.
3. Make it your own.

| Component | Responsibility |
| --- | --- |
| Message | Conversation layout |
| PromptInput | Input surface |
| Trace | Reasoning and tool activity |

- [x] Light and dark themes
- [x] Responsive layouts
- [ ] AI SDK integration (next phase)

\`\`\`ts
const theme = preference === "dark" ? darkTheme : lightTheme;
\`\`\``;
export const japanese = '日本語のメッセージも自然に表示できます。長い文章やコードを含む会話でも、余白と読みやすさを保ちます。';
