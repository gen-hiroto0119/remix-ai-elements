# Remix AI Elements — 設計案

更新日: 2026-10-16 / 第3版 / 状態: 基本方針合意済み・未実装

第2版の変更: 外部CSSファイル配布をRemix標準の`css()`／`mix`へ変更。サーバー側AI SDKとの接続を後続機能ではなく初期版の主経路に変更した。

第3版の変更: 基本方針の合意を反映。リポジトリ内にReact＋shadcnの参照アプリを分離して置き、実物とソースを比較しながら表示部品から移植する進め方を追加した。

## 1. 目的と前提

shadcn AI Elementsの見た目・機能・組み合わせ方を、Remix v3ネイティブのコンポーネントとして提供する。特定アプリのチャット画面ではなく、他のRemix v3プロジェクトから利用できる公開npmパッケージにする。

### 合意済み

- 配布はnpmパッケージ方式。ソースコピー方式やshadcn CLIを前提としない。
- 公開するRemixパッケージはReactに依存しない。`remix/component`で実装する。開発用のshadcn参照アプリは例外として分離する。
- Remix v3正式版を対象とする。React Router v7／Remix v2向けのライブラリではない。
- 特定のAIプロバイダーやバックエンドを必須にしない。
- サーバー側AI SDKと組み合わせて利用できる形を初期版から提供する。モデル呼び出し・ツール実行・秘密鍵はサーバーに置く。
- スタイルを含め、まずRemixが提供する標準機能を使う。標準機能にない用途だけ外部依存や独自実装を検討する。
- 今回は設計のみ。実装、npm公開、サイト公開は行わない。

### 合意した基本方針

- 初期版は小さな部品を組み合わせる構成とし、チャット全体を管理する巨大な`Chat`コンポーネントは提供しない。
- スタイルは`remix/component`の`css()`で定義し、`mix`で適用する。Tailwind、追加のCSS-in-JSライブラリ、必須のCSSファイルimportは不要にする。
- 同じnpmパッケージ内に、UI部品と任意で使う`/ai-sdk`接続入口を分けて提供する。UI単体の利用ではAI SDKを読み込まず、AI SDK連携を利用する場合は公式のフレームワーク非依存APIを再利用する。
- `@remix-run/ui`は必要な高度な操作部品に限って検討し、初期版の必須依存にはしない。

## 2. 調査結果と移植の意味

| 確認事項 | 設計への反映 |
| --- | --- |
| `remix@3.0.0`は正式公開済み。npmメタデータでも確認 | まず3.0.0を基準バージョンとして実装・検証する |
| Remixのコンポーネントはsetup関数からrender関数を返す。更新は`handle.update()` | React Hooks／Contextを機械的に置換せず、状態と更新の責務を組み直す |
| Remix正式版に`css()`があり、疑似セレクター・メディアクエリー・cascade layersに対応。SSR rendererがstyleタグを出力する | 別のCSS配布基盤を作らず、Remixの仕組みに乗せる |
| `clientEntry`の境界を越えるpropsはシリアライズ可能な値が必要 | 接続処理とコールバックはアプリ側のクライアント境界内で生成する |
| 公式shadcn UI／AI Elementsの実装はReact向け | React、Base UI／RadixのReact実装、`@shadcn/react`をそのまま依存に入れない |
| 新しいAI ElementsはMessage・Message Scroller・Traceなどを組み合わせるパターン集 | 新版を移植元とする。旧`Conversation`などのAPI互換は初期目標にしない |
| `@remix-run/ui`はRemix本体とは別バージョンで、公式READMEではunstable | 本体の安定性とは分けて判断。利用する場合は内部に閉じ込める |
| 調査したAI SDK 7.0.142は`AbstractChat`、`ChatState`、`DefaultChatTransport`を公開exportしている | React HooksなしでSDKの通信・メッセージ更新処理を再利用し、Remix向け購読部分を薄く実装する |

目標は**見た目・操作・意味の対応**であり、React版とのprops・ref・Hooksの完全互換ではない。上流の構成を参考にしつつ、Remixで自然に使えるAPIにする。

初期のビジュアル基準はshadcnのBase版AI Elementsパターンとする。ここでいうBaseは参照するデザイン・構成であり、React向けBase UIを採用する意味ではない。実装開始時に参照コミットを固定し、途中の上流変更で完成条件を変えない。

### 実物を参照する進め方

- `examples/shadcn-reference`に、開発専用・非公開のReact＋shadcnアプリを置く。必要なAI Elementsパターンを導入し、取得元・バージョン／コミット・ライセンスを記録する。
- React、shadcn、Tailwind等は参照アプリの依存に閉じ込め、RemixパッケージやRemix playgroundからimportしない。参照アプリ自体もnpm公開物に含めない。
- `examples/playground`のRemix版と、同じメッセージ・画面幅・テーマ・状態で見比べる。ソースだけでなく、キーボード操作、スクロール追従、ストリーミング中の挙動も確認する。
- 最初はMessage、次にPromptInputとMessageScrollerを作る。全表示部品を作り切る前に`createChat()`とサーバーAI SDKをつなぎ、送信→ストリーミング表示→停止まで通す。その後にReasoning・Tool・Trace等を広げる。
- shadcn/ui全体の先行移植はしない。AI Elementsに必要な小さな部品だけをRemixで実装する。

## 3. アーキテクチャ

```text
サーバー（利用アプリ）
  Remix route action
    ├─ 認証・入力検証・会話の永続化
    └─ AI SDK（モデル呼び出し・サーバーツール実行）
         └─ UI Message Streamを通常のResponseとして返す
                          │ HTTP / SSE
ブラウザー               ▼
  remix-ai-elements/ai-sdk（任意の接続入口）
    ├─ SDKのDefaultChatTransport / AbstractChat
    └─ 購読可能な会話状態 → handle.update()
                          │ props / children
  remix-ai-elementsのUI部品
    ├─ Message / MessageScroller / PromptInput
    ├─ Trace / Reasoning / Tool / Markdown / CodeBlock
    └─ remix/componentのcss() / mix / イベント / lifecycle
```

### ライブラリが持つ責務

- 表示、UI内の一時的な状態、入力操作、折りたたみ、スクロール、コピー操作。
- キーボード操作、意味のあるHTML、必要なARIA、テーマ。
- 呼び出し元から受け取った内容・実行状態の描画。
- `/ai-sdk`入口を使う場合は、SDKの会話状態をRemixへ通知する購読・破棄の橋渡し。プロトコル処理やAI実行エンジンを再実装しない。

### 利用アプリが持つ責務

- 会話の永続化、送信方針、認証、履歴、課金、サーバーの処理。クライアントのメッセージ状態・送信・中断は付属の接続層を利用できる。
- ツールの実行・承認、ファイルアップロード、AIの出力を業務処理へ反映する判断。
- モデルが提供しない推論内容をUI側で生成・推測しない。Reasoningは渡された内容だけを表示する。

ButtonやTextareaなどの小さな共通実装は内部に持つが、shadcn/ui全体の移植や汎用デザインシステムの公開はしない。内部の共通部品を公開APIとして固定しない。

## 4. npm配布と互換性

パッケージ名`remix-ai-elements`は仮称。名前の空き・所有権は公開前に確認し、必要ならユーザースコープを使う。

| 項目 | 提案 |
| --- | --- |
| 形式 | ESMのJavaScriptと型宣言を配布。スタイルはJS内のRemix `css()`定義。利用者にTSXのビルドを要求しない |
| ビルド | TypeScriptでJSXをRemix runtime向けに変換。`jsxImportSource: "remix/component"` |
| Remix依存 | `peerDependencies`に`remix: ^3.0.0`。開発・最小互換テストは3.0.0に固定 |
| AI SDK依存 | `/ai-sdk`用に`ai`をoptional peerとする。初期検証基準は7.0.142。公開時は検証済み7.x範囲だけを宣言し、6.x互換は未保証とする |
| モジュール | 部品ごとのsubpath export。ブラウザー向けコードにNode組み込みAPIを入れない |
| 副作用 | module importでDOM操作・購読を開始しない。スタイル登録・解放は描画時のRemix runtimeへ委ねる |
| バージョニング | 初期は0.x。破壊的変更はminorを上げ、変更点と移行方法を記載する |
| 環境 | 基準デモはNode 24.3.0以上。これはRemix 3.0.0の要件に合わせるもの |

初期のexport候補:

```text
remix-ai-elements/message
remix-ai-elements/message-scroller
remix-ai-elements/prompt-input
remix-ai-elements/trace
remix-ai-elements/reasoning
remix-ai-elements/tool
remix-ai-elements/markdown
remix-ai-elements/code-block
remix-ai-elements/theme
remix-ai-elements/ai-sdk
```

全コンポーネントを再exportする大きな入口は初期版では作らない。Remixのimport mapベースの配信でも、Messageを使うだけでMarkdownパーサーやAI SDKまで読み込まない依存関係にする。ファイル内部にも同じ原則を適用する。`/theme`はCSS変数を設定するRemix mixinの入口とし、CSSファイルを読み込むための入口にはしない。

Remix本体をバンドルに含めず、JSX runtimeやcontextの重複を避ける。Bun／Deno、他フレームワークでの利用、CJSは初期の保証対象にしない。ブラウザーの保証範囲は初回公開時点のChromium・Firefox・Safari安定版とし、実ブラウザー／対応環境で確認できた範囲を公開する。

## 5. 初期コンポーネントと公開API

以下は提案APIであり、実装済みAPIではない。UI部品のpropsにはReactやAI SDKの型を漏らさない。一方、`/ai-sdk`入口はSDK連携が目的なので`UIMessage`などSDKの公開型を使い、情報を失う独自メッセージ形式への変換を強制しない。

| 部品 | 主な責務・API案 |
| --- | --- |
| `Message` / `MessageContent` / `MessageActions` | 1ターンの外枠と内容。`from`、`align`、`children`。文章の解釈や通信はしない |
| `MessageScroller` / `MessageScrollerContent` / `MessageScrollerButton` | スクロール領域と追従・末尾へ戻る操作。メッセージデータの形式は知らない |
| `PromptInput` / `PromptInputTextarea` / `PromptInputSubmit` / `PromptInputStop` | 入力、送信・停止の操作。`value`、`onValueChange`、`status`、`onSend`、`onStop` |
| `Trace` / `TraceItem` | 処理の一覧。`status`、タイトル、アイコン、本文。推論・ツール表示の共通レイアウト |
| `Reasoning` | 渡された推論テキストと進行状態を表示。`open` / `defaultOpen` / `onOpenChange`。本文はchildrenとして差し替え可能 |
| `Tool` | 呼び出し名・実行状態・入力・結果・エラーの表示枠。実行や承認の送信はしない |
| `Markdown` | Markdownテキストを安全なRemixノードへ変換。`text`。独立した入口から利用する |
| `CodeBlock` | コード本文、言語ラベル、コピー操作。まずプレーン表示を確実にし、ハイライトは後続で追加する |

### 状態の契約

- 会話データと入力値は利用アプリが所有する。PromptInputの入力値は初期版ではcontrolledに統一する。
- `onSend({ text })`は送信意図の通知。ライブラリが勝手に通信したり、入力をクリアしたりしない。送信受付後のクリア・失敗時の保持はアプリが決める。
- `status`は`idle | submitting | streaming | error`を候補とし、入力を禁止するかは別の`disabled`で指定できる。生成中の次の下書き作成を妨げない。
- 初期版では送信ボタンは空白のみ・送信中・生成中に無効化。停止操作は`onStop`が提供されている場合だけ表示する。多重送信防止とキャンセルの最終保証はアプリ側が行う。
- 開閉はcontrolledとuncontrolledを明確に区別する。`open`を渡す場合は`onOpenChange`を必須にする。自動開閉はuncontrolled時だけ行い、ユーザーが閉じたパネルをトークン到着ごとに開き直さない。
- Toolの表示状態は`pending | running | success | error`を候補とし、SDK固有の状態名は境界で変換する。

### 組み合わせ・拡張

- `children: RemixNode`を中心に組み合わせる。モデルのメッセージ全体を受け取って全UIを自動生成する方式にはしない。
- DOMの属性はRemix側の型から導出し、`className`、`aria-*`、`data-*`などを必要なルートへ渡せるようにする。内部専用propsをDOMへ漏らさない。
- DOMイベントはRemixの`mix`／`on`で実装する。コンポーネントの`onSend`などは意味のある操作コールバックとして分ける。
- スタイルや追加のDOM振る舞いを合成するため、対応するルート要素に`mix`を渡せるようにする。基本スタイル→利用者のmixの順とし、内部のイベント処理を誤って消さない合成契約を定める。
- `asChild`や任意タグへの完全なpolymorphismは初期版に含めない。フォーム・ボタン・見出しの意味とフォーカス制御を壊さない拡張から始める。
- 文言はpropsで差し替え可能にする。英語を既定にしつつ、デモでは日本語・長文でも確認する。

## 6. RemixのライフサイクルとSSR

- コンポーネントはsetupで初期化し、render内では最新の`handle.props`を読む。初期値として意図したもの以外をsetupで固定しない。
- `window`、`document`、`ResizeObserver`、クリップボードへのアクセスはmodule scopeやSSR中に行わない。
- DOM依存処理はmixinの`insert`／`commit`やqueued taskで行う。observer・listener・timerは対応するライフサイクルで必ず解放する。
- ライブラリは`run()`を呼ばず、rootやルーターを作らない。アプリが1つのRemix runtimeを起動する。
- ライブラリ内で各部品を無条件に`clientEntry`化しない。アプリ側のChatPanelなどがクライアント境界になり、その内側で部品を組み合わせる。SDK接続は会話単位のインスタンスとし、SSRでリクエストをまたいで共有しない。
- サーバーから境界へ渡すのは初期メッセージ・表示設定・API URLなど。コールバック、File、SDKインスタンス、秘密鍵は渡さない。
- SSRと初回クライアント描画の内容を一致させる。表示IDは`handle.id`等を使い、乱数や現在時刻に依存しない。
- SSRだけでも会話本文・コード・ツール結果を読める。送信・追従・コピーなどJSが必要な操作はハイドレーション後に有効化する。JSなし送信は初期保証に含めない。

## 7. スタイリングとデザインの再現

### Remix標準のcss()を採用する

shadcn版のレイアウト・余白・色・状態表現を、`remix/component`の`css()`オブジェクトへ移植し、要素の`mix`で適用する。独自のCSSランタイム・抽出ビルド・外部CSSファイル配布は作らない。Tailwindも不要。

- 静的な定義はmodule scopeで共有する。module scopeでは定義だけを作り、DOMへ挿入しない。
- `:hover`／`:focus-visible`、属性・子孫セレクター、メディアクエリーは`css()`内で表現する。
- 高頻度で変わる値は`style`や動的CSS変数を使い、ストリーミング更新ごとに新しいCSSルールを生成しない。
- テーマ変数は`--reai-background`、`--reai-foreground`、`--reai-muted`、`--reai-border`、`--reai-accent`、`--reai-radius`などを候補とする。部品は`var()`のfallbackで既定値を持ち、親で設定した変数を引き継ぐ。
- `/theme`ではライト／ダークの変数を親要素へ適用するmixinを提供する。テーマ状態・保存・OS設定との同期はアプリ側が持つ。
- `mix`、CSS変数、`className`、安定した部位属性を拡張点とする。生成クラス名は公開APIとしない。
- グローバルreset、`body`へのスタイル、独自のcascade layer管理を追加しない。必要なフォーム補正は部品内に限定し、フォントは原則inherit。
- アイコンはReact版lucideを使わず、Remixで描画できるSVGとして実装する。装飾用は支援技術から隠し、ボタンには別途ラベルを与える。

### SSR・ハイドレーション・カスケード

Remixの正式版ソースでは、SSRが`data-rmx-style`付きstyleタグを生成し、クライアント側がスタイルを引き継ぐ仕組みがある。ライブラリ側に別のstyle収集・注入処理を設けない。

生成ルールはRemixの`rmx` layerに入る。レイヤー外のアプリCSSが優先すること、アプリのresetやlayer順との関係を導入ガイドに記載する。ネストしたframeや再マウントでのスタイル維持は初回の導入検証に含める。厳格なCSPとの互換性はRemixのstyle出力方式も含めて別途確認し、未検証のまま保証しない。

アクセス制限付きアセット配信では利用パッケージとpeerの`remix`を`allowPackages`へ明示する。接続入口を使う場合はpeerの`ai`も対象になる。CSSのための追加`<link>`やimportは不要とする。

## 8. 難所の仕様

### スクロール追従

- 末尾付近にいる間はストリーミング・画像やコード等の高さ変更に追従する。
- ユーザーが上へ移動したら追従を解除する。新しいトークンで閲覧位置を奪わない。
- 「末尾へ」操作で追従を再開する。`prefers-reduced-motion`を尊重する。
- 履歴を先頭に追加しても閲覧中の要素を基準に位置を保つ。安定したkeyはアプリが渡す。
- 再マウント・画面遷移でobserverやイベントが残らないようにする。
- 初期版は全メッセージを描画する。仮想化、上流Scrollerの全機能互換、巨大履歴の性能保証は後続とする。

### 入力

- Enterで送信、Shift+Enterで改行。IME変換確定のEnterで送信しない。
- 送信後もフォーカスを不必要に奪わず、テキスト選択・コピーを妨げない。
- 停止は要求を通知するだけ。通信中断後の遅れて届く更新を捨てる責務はアプリにある。
- ファイル添付、ペースト画像、音声入力、モデル選択は初期版に含めない。

### Markdownと安全性

- `remark-parse`＋`remark-gfm`を候補にASTを作り、許可したノードをRemix要素へ変換する。採用バージョンとブラウザー配信は実装前の検証項目とする。
- 対象は段落・見出し・強調・リスト・引用・リンク・コード・表・取り消し線・表示専用タスクリスト。生HTMLを実行しない。
- URLは用途ごとに検証する。リンクはhttp(s)・mailto・安全な相対URLに限定し、javascript・data等の実行につながるスキームを拒否する。
- Markdown内の外部画像は初期版では自動取得しない。画像表示が必要なアプリは独自rendererで明示的に扱う。
- 途中のコードフェンスやリンクなど未完の入力でも例外を出さずに表示する。Streamdownとの完全同一表示は約束しない。
- 完了済みメッセージの再解析を避け、変化した本文だけを再解析する。更新をまとめても最終本文を落とさない。
- 数式・Mermaid・HTML埋め込み・実行可能なプレビューは初期版に含めない。
- Toolの結果はテキスト／子要素として表示する。結果内のコードを実行せず、機密値のマスキングはアプリ側で行う。

### アクセシビリティ

- 入力には可視ラベルまたは明確なアクセシブル名を付ける。
- 折りたたみは可能な範囲でnative `details`／`summary`を利用する。独自実装が必要な場合はbuttonと`aria-expanded`／`aria-controls`を対応させる。
- トークンごとの全文読み上げは避ける。会話領域と分離したpoliteなstatusで生成開始・完了・エラーを通知する。
- コピー成功・失敗、送信中、無効状態を色だけで伝えない。
- キーボード操作、200%ズーム、長文折り返し、ライト／ダーク、reduced motionを確認する。

## 9. AI SDKとの接続

### 方針: サーバー側AI SDKを初期版の標準接続例にする

UI部品はSDK非依存に保ちつつ、同じパッケージの`/ai-sdk`入口からRemix向けの会話接続を提供する。アダプターは初期版に含め、別npmパッケージへの分割は当面行わない。AI SDKの公式Remix連携が既に存在すると主張するものではなく、SDKの公開基盤に薄いRemix接続を加える設計。

**AIの実行はサーバーだけに置く。** ブラウザーにも`ai`の通信・メッセージ状態管理APIは使うが、モデル呼び出し・provider設定・APIキー・サーバーツール実装を持ち込まない。Reactや`@ai-sdk/react`の`useChat`は使わない。

### サーバーの処理フロー

Remixの`remix/router`は標準のRequest／Responseを扱えるので、専用のサーバーランタイムを追加する必要はない。利用アプリが`POST /api/chat`相当のactionを定義する。

1. 認証、会話IDの所有権、サイズ制限、送信回数制限、必要に応じたOrigin／CSRF対策を行う。クライアントの会話履歴やtool結果を権威ある記録として無条件には信用しない。
2. サーバーで許可した履歴と新規入力を組み立て、`validateUIMessages()`で構造・tool／data／metadataのスキーマを検証する。構造検証は認可の代わりにはならない。
3. `await convertToModelMessages(messages)`でモデル入力に変換する。
4. `streamText({ model, messages, abortSignal: request.signal, ... })`で生成する。`model`やtool定義はアプリのサーバー専用モジュールに置く。複数ステップの自律的なtool loopが必要な例は、現行SDKの`ToolLoopAgent`を別途使う。
5. `toUIMessageStream({ stream: result.stream, originalMessages: messages, ... })`でtext／reasoning／tool等を含むUI Message Streamに変換する。
6. `createUIMessageStreamResponse({ stream })`をそのままactionから返す。これはSDKがSSEにエンコードした標準Responseであり、RemixのHTML responseで包み直さない。

上記は処理順序とAPIの指定であり、完成した認証付きサンプルコードではない。具体的なprovider・モデル・認証方式は利用アプリが選ぶ。AI SDK 7.0.142のdocs／sourceで確認したAPIを基準とする。7系で非推奨の`result.toUIMessageStreamResponse()`ではなく、トップレベルの変換関数を採用する。

推論内容を送るかどうかはサーバーで明示する。調査版の`toUIMessageStream`は`sendReasoning: true`が既定なので、非公開にしたいアプリでは必ず`false`にする。モデルが公開しない推論は生成・補完しない。tool入出力にも機密情報があり得るため、UIへ送るデータを許可リストで設計する。内部エラーやproviderのエラーを無加工でクライアントへ流さない。

### Remix側の接続API案

公開名は`createChat<UI_MESSAGE extends UIMessage>()`を候補とする。以下は本ライブラリがこれから提供するAPIであり、AI SDK既存の関数名ではない。

| API案 | 責務 |
| --- | --- |
| `createChat({ id, api, messages, ... })` | 会話単位の状態を生成。サーバー発行の会話IDとSSR時の初期messagesを引き継ぐ |
| `chat.messages`／`chat.status`／`chat.error` | SDKの状態を参照。statusは`submitted`／`streaming`／`ready`／`error` |
| `chat.sendMessage({ text })` | 公式transportを通して送信する |
| `chat.stop()` | 進行中の通信・生成に対して中断を要求する |
| `chat.subscribe(listener)` | 変更通知を購読し、解除関数を返す。listenerから`handle.update()`を要求する |
| `chat.dispose()` | 購読と予約済み通知を解除し、所有する通信を停止する |

内部は公開APIの`AbstractChat`と`DefaultChatTransport`を再利用し、Remix向けの通知可能な`ChatState`を実装する。messagesの代入・push／pop／replaceだけでなく、statusとerrorの変更も通知する。SDKが要求するsnapshotの分離契約も守り、ストリーム処理中のmutable値を過去のUI状態と共有しない。通知はまとめられるが、最後の更新とerrorを落とさない。

`ChatPanel`のsetupで会話インスタンスを生成し、render関数はその最新状態を読む。初回SSRでは渡された履歴を描画するだけで、生成リクエストを開始しない。ブラウザーでの購読はマウント後の`handle.queueTask()`に置き、`handle.signal`のabortに合わせて解除する。コンポーネントが所有するインスタンスはそこでdisposeする。再接続する場合は、その接続に対応する購読を作り直す。

サーバーから`clientEntry`へ渡すのは`id`、`api`、JSONとしてシリアライズ可能な`messages`などだけ。chatインスタンス、購読関数、モデル、秘密鍵は渡さない。会話切り替え時は古い購読を解除し、古いレスポンスを新しい会話へ混ぜない。モジュールグローバルに共有chatを作らない。

### メッセージの表示と拡張

アダプターはSDKの`UIMessage.parts`を保つ。独自の縮約形式へ変換してtool情報やmetadataを失う設計にはしない。UI部品そのものへ`UIMessage`全体を必須化せず、アプリ側のrenderで必要な値を渡す。

- `text` → MessageContent内のMarkdown。
- `reasoning` → Reasoning。サーバーから公開された内容だけを表示する。
- tool part → Tool／Trace。SDKのtool判定ヘルパーを使い、入力受信中・実行待ち・出力・失敗・承認状態を区別する。入力完了を実行成功と扱わない。
- 初期版に専用UIがないsource／file／data part → 元データは保持し、アプリ側のrendererで拡張できるようにする。未知のpartを無条件にJSON表示して情報を漏らさない。

### ストリームと停止の境界

- 初期ページのSSR／HTMLストリーミングと、AI回答のSSEストリーミングは別の通信経路。トークンごとにページやRemix frameをreloadしない。
- SSEパーサー・部分JSONの復元・メッセージ差分適用を独自実装しない。公式transportとAbstractChatへ委ねる。
- `onSend`は`sendMessage()`、`onStop`は`stop()`へ接続する。二重送信の方針はアプリで定め、基準例は生成中の追加送信を無効にする。
- stop後も既に受信したテキストは残す。中断は正常なユーザー操作として扱う一方、ネットワーク失敗・モデル失敗はerrorとして表示する。
- `request.signal`をモデル呼び出しへ接続しても、接続切断の伝播はHTTP adapterやproxyに依存する。生成・課金の即時停止や、実行済みtoolの取り消しは保証しない。確実なサーバー停止が必要なアプリでは、認証付きrun cancellationを別途設計する。
- 自動リトライや自動再送は初期例で有効にしない。再開はSDKだけでは完結せず、サーバー側の保存・再生・重複抑止が必要なので後続対応とする。停止と継続生成型のresumeを同時に保証しない。
- APIキーなしの決定的なモックも実サーバーと同じUI Message Stream形式にする。実AI SDKのサーバー接続例も初期版に含め、鍵がある場合だけ実モデルへのsmoke testを行う。

## 10. リポジトリ構成案

```text
packages/
  remix-ai-elements/
    src/
      message.tsx
      message-scroller.tsx
      prompt-input.tsx
      trace.tsx
      reasoning.tsx
      tool.tsx
      markdown.tsx
      code-block.tsx
      theme.ts
      ai-sdk.ts          # SDK公開APIへの薄い接続。UI部品からはimportしない
      internal/
    package.json
    tsconfig.json
    LICENSE
    THIRD_PARTY_NOTICES
examples/
  playground/          # Remix正式版、各部品とチャットの組み合わせ例
  shadcn-reference/    # 非公開のReact＋shadcn参照アプリ。公開パッケージから分離
tests/
  package-consumer/    # npm packした成果物を導入する互換性テスト
docs/
  design.md
```

pnpm workspaceを候補にし、初期は公開パッケージ1つ、Remix playground、非公開のshadcn参照アプリに絞る。Turborepoや専用CLIは導入しない。ドキュメントはREADMEとplaygroundから始め、別のドキュメント用フレームワークを増やさない。

## 11. 段階と完成条件

| 段階 | 成果物 | 完成条件 |
| --- | --- | --- |
| 準備: 参照環境 | React＋shadcnの参照アプリ | 比較対象の実物とソースをリポジトリ内で参照でき、取得元・バージョン・ライセンスが記録されている |
| 0: 導入経路の検証 | MessageとRemix `css()`だけの最小パッケージ | `npm pack`した成果物を別のRemix 3.0.0アプリへ導入でき、SSR・ハイドレーション・スタイル・型が成立する。公開パッケージの依存グラフにReactがない |
| 1: 基本チャットとSDK接続 | Message、Scroller、PromptInput、`/ai-sdk`、サーバーSDK接続例、同一形式のモック | 日本語IME、送信、ストリーミング、停止、エラー、購読解除、追従再開が成立する |
| 2: 初期公開候補 | Trace、Reasoning、Tool、Markdown、CodeBlock、テーマ、導入文書 | SDKのtext／reasoning／toolを組み合わせたデモと安全性・アクセシビリティ・公開成果物の検査を満たす。ここを最初の0.1公開候補とする |
| 3: 拡張 | 再接続・resume、添付、Sources、Suggestion、ハイライト等 | 実利用で必要なものから追加。旧版全機能の一括移植はしない |

### 公開前の検証

- TypeScriptの型検査、lint、部品のSSR／イベント／状態更新テスト。
- SDK接続はtext／reasoning／toolの混在、受信中の停止、HTTP／streamエラー、会話切り替え・破棄後の遅延通知を確認する。
- パーサーの悪意あるHTML・URL、未完Markdown、長文へのテスト。
- 実ブラウザーでハイドレーション、IME、スクロール、フォーカス、テーマを確認する。
- 基準画面と同じ条件で上流デザインとの見た目を比較する。computed styleやDOM検査だけで合格にしない。
- `npm pack`した実物を、workspace参照ではないconsumerへ導入する。exports、型、Remixのスタイル出力、ライセンス、SSR安全性を確認する。`ai`をインストールしないUI単体のconsumerも確認する。
- 最小対応版と公開時点の最新互換Remix 3.xで検証する。未検証ランタイム・ブラウザーを対応済みと記載しない。
- バンドル／import graphを確認し、Messageだけの利用でMarkdownやAI SDKが読み込まれないことを確認する。
- `/ai-sdk`利用時にもReactやprovider設定・秘密情報がブラウザーへ入らないことを確認する。接続入口のクライアントサイズも計測し、SDKの全exportを無条件に配信する構成になっていないか調べる。

テストコマンドは実装時にscriptsとして定義する。今回はコード・ビルド・ブラウザーテストを実行していないため、以上は受け入れ条件であって検証済み結果ではない。

## 12. ライセンス・公開方針

- 新しいshadcn/uiはMIT。コードを移植する場合は著作権表示とライセンスを維持する。本プロジェクトもMITを提案する。
- 旧Vercel AI ElementsはApache-2.0。旧版のコードを取り込む場合は別扱いとし、適用されるライセンス・変更表示・NOTICE等の条件を満たす。全体を一律MITとして扱わない。
- 依存・アイコン等の第三者著作物を棚卸しし、配布物にも必要な表示を含める。
- 「非公式のRemix向け移植」であることを明記し、shadcn／Remix公式と誤認させない。
- npm公開はユーザーの承認後に行う。利用可能な認証方式に合わせてtrusted publishing等を検討し、現在公開権限があるとは仮定しない。

## 13. 合意した設計方針のまとめ

大枠のnpm配布・Remixネイティブ・公開コンポーネント集と、以下の基本方針は合意済み。詳細なpropsや依存バージョンの保証範囲は、実装時の検証で確定する。

1. **スタイルはRemix標準の`css()`／`mix`へ統一する。** 外部CSSファイルの必須読み込みやTailwind依存を増やさない。
2. **初回は基本チャット＋Trace系＋安全なMarkdownに絞る。** 添付・高度なMarkdown・旧版互換は後続にする。
3. **サーバーAI SDKとの接続を初期版に含める。** 同じパッケージの`/ai-sdk`で提供し、UI部品はSDK非依存、接続入口はSDK公開型をそのまま使う。ブラウザーではSDKの通信・状態管理だけを利用する。
4. **初期必須部品はWeb標準とRemixで実装する。** Popover等を増やす段階で`@remix-run/ui`を評価し、unstableな型を公開APIに漏らさない。
5. **shadcnの実物とソースを見ながら表示部品から実装する。** 参照用Reactアプリは分離し、最小チャットの接続を確認してから部品を広げる。

## 参照

調査日: 2026-10-16。Remixの設計は正式版タグを基準とし、shadcnの移植元コミットは実装開始時に固定する。

- [Remix 3.0.0正式リリース](https://github.com/remix-run/remix/releases/tag/remix%403.0.0)
- [Remix 3.0.0 component README](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/component/README.md)
- [Remix 3.0.0 mixins](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/component/docs/mixins.md)
- [Remix 3.0.0 styling](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/component/docs/styling.md)
- [Remix 3.0.0 handle lifecycle](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/component/docs/handle.md)
- [Remix 3.0.0 SSR style出力](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/component/src/server/stream.ts)
- [Remix 3.0.0 fetch-router](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/fetch-router/README.md)
- [Remix 3.0.0 assets](https://github.com/remix-run/remix/blob/remix%403.0.0/packages/assets/README.md)
- [Remix Interactivity](https://guides.remix.run/interactivity/)
- [Remix UI](https://github.com/remix-run/remix/tree/main/packages/ui)
- [shadcn AI Elements](https://ui.shadcn.com/docs/ai-elements)
- [shadcn Chat pattern](https://ui.shadcn.com/docs/ai-elements/base/chat)
- [shadcn Message Scroller source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/message-scroller.tsx)
- [shadcn Trace source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/trace.tsx)
- [shadcn MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
- [旧Vercel AI Elementsと移行予告](https://github.com/vercel/ai-elements)
- [旧Vercel AI Elements license](https://github.com/vercel/ai-elements/blob/main/LICENSE)
- [AI SDK 7 migration guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0)
- [AI SDK transport](https://ai-sdk.dev/docs/ai-sdk-ui/transport)
- [AI SDK stream protocols](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)
- [AI SDK package 7.0.142](https://www.npmjs.com/package/ai/v/7.0.142) — 同梱docsと`src/ui/chat.ts`、`src/ui/default-chat-transport.ts`、`src/ui-message-stream/`を確認。上記APIを組み合わせたRemixアプリの実動確認は今後の実装段階で行う。
