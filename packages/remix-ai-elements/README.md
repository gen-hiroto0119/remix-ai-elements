# remix-ai-elements

## Full visual catalog

The [coverage table](../../docs/visual-coverage.md) maps all 21 official AI Elements patterns to this package. In addition to the original building blocks, individual entrypoints expose:

`chain-of-thought`, `checkpoint`, `confirmation`, `context`, `file-tree`, `inline-citation`, `model-selector`, `plan`, `queue`, `sources`, `stack-trace`, `subagent`, `suggestion`, `task`, `terminal`, and `test-results`.

```tsx
import { Plan } from "remix-ai-elements/plan";
import { Confirmation } from "remix-ai-elements/confirmation";
import { Context } from "remix-ai-elements/context";

<Plan title="Add settings" steps={[
  { id: "tokens", title: "Define tokens", status: "success" },
  { id: "ui", title: "Build controls", status: "running" },
]} />;
<Confirmation title="Run the command?" state="pending"
  onDecision={(approved) => console.log(approved)} />;
<Context input={8420} output={1260} reasoning={980} limit={128000} />;
```

Callbacks belong to the consuming application; these components do not execute commands or call AI services. `ModelSelector` and `FileTree` support `value`/`defaultValue` and a change callback (`onValueChange` and `onSelect`, respectively). Popovers use the native HTML Popover API with viewport-constrained positioning; use a modern browser. All styles remain self-contained Remix `css()` mixins.

Remix 3の表示部品。現在は見た目を確認する初期版です。APIは未安定・npm未公開です。

```tsx
import { Message, MessageContent, MessageBubble } from 'remix-ai-elements/message';
import { Markdown } from 'remix-ai-elements/markdown';
import { darkTheme } from 'remix-ai-elements/theme';

export function Conversation() {
  return () => (
    <section mix={darkTheme}>
      <Message from="user">
        <MessageContent><MessageBubble>Hello!</MessageBubble></MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent><Markdown content="Hello, **Remix**." /></MessageContent>
      </Message>
    </section>
  );
}
```

## Entrypoints

| Import | Main exports |
| --- | --- |
| `/message` | Message, MessageGroup, MessageContent, MessageBubble, MessageHeader, MessageAvatar, MessageActions, MessageAction |
| `/message-scroller` | MessageScroller, MessageScrollerContent, MessageScrollerButton |
| `/prompt-input` | PromptInput, PromptInputTextarea, PromptInputToolbar, PromptInputAction, PromptInputSubmit, PromptInputStop |
| `/trace` | Trace, TraceLine, TraceTitle, TraceDescription, TraceIcon, TraceDisclosure |
| `/reasoning` | Reasoning |
| `/tool` | Tool |
| `/markdown` | Markdown |
| `/code-block` | CodeBlock, CodeBlockCopyButton |
| `/theme` | lightTheme, darkTheme, tokens |

部品は対応するDOM属性と`mix`を受け取り、内部スタイルの後で利用者のmixinを合成します。`TraceDisclosure`は`defaultOpen`で初期状態を指定し、制御する場合は`open`と`onOpenChange`を組み合わせます。`Reasoning`の`duration`は秒です。`Tool`は文字列の`input`・`output`を表示し、`pending | running | success | error`を受け取ります。JSONなら利用側で`JSON.stringify`してください。

`MessageScrollerButton`の`targetId`には、対応する`MessageScroller`の`id`を渡します。自動追従はまだ行いません。`PromptInput`はsubmitのページ遷移を抑止する表示用フォームです。独自の送信処理やEnterキー送信は持ちません。

`PromptInputTextarea`は手動リサイズを無効にし、CSSの`field-sizing: content`で内容に合わせて高さを調整します。高さの初期範囲は76〜240pxで、上限を超えた内容のみ縦スクロールします。高さの自動調整には`field-sizing`対応ブラウザーが必要です。未対応ブラウザーでは`rows`に基づく高さでスクロールできます。サイズ制約は`mix`から変更できます。

## Styling

追加のCSS importやTailwind設定は不要です。Remixの`css()`がSSR／ブラウザーのスタイル生成を担当します。フォントは利用側から継承します。`lightTheme`／`darkTheme`は親要素へ適用してください。切り替え・保存・OS設定との同期は利用側の責務です。

`--reai-background`、`--reai-foreground`、`--reai-muted`、`--reai-subtle`、`--reai-border`、`--reai-primary`、`--reai-primary-foreground`、`--reai-destructive`、`--reai-ring`、`--reai-radius`を上書きできます。固定の生成クラス名ではなく、props・`mix`・`data-slot`を拡張点にしてください。

Remixのスタイルは`rmx` cascade layerに入ります。レイヤー外のアプリCSSが優先されるため、利用側のresetやlayer順を確認してください。ライブラリはグローバルreset・bodyスタイル・root起動を追加しません。

## Current limits

- 表示専用です。`createChat()`・AI SDK・バックエンド・ストリーミングは未実装です。
- MarkdownはGFMの基本構造に対応。HTMLは文字列として表示し、画像はaltテキストのみ、リンクはHTTP(S)／mailto／相対URLに制限します。コードはプレーン表示で、構文ハイライトや数式はありません。
- コピーなどのブラウザー操作には、利用アプリ側のマウント／ハイドレーションが必要です。コピーはClipboard APIの利用可能なsecure contextで動作します。
- 部品SSRの確認と、利用アプリのハイドレーション対応は別です。フルアプリのSSR経路・ストリーミング中の更新は次段階で検証します。
- npm公開や本番利用の保証はまだ行いません。

shadcn/uiのデザインを参考にしています。保存したライセンスと取得元は`LICENSES`を参照してください。
