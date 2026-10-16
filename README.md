# remix-ai-elements

shadcn AI Elementsを参考にした、Remix v3ネイティブのnpmコンポーネント集です。現在は**見た目を確認する初期実装**で、npmには未公開です。

- [設計・実装方針](docs/design.md) — AI SDK接続など、今後の全体設計
- [表示部品の使い方](packages/remix-ai-elements/README.md)
- [公式21パターンとの対応・差分](docs/visual-coverage.md)
- [公式Remix 3 Skill](.agents/skills/remix/SKILL.md) / [取得元・バージョン](.agents/skills/remix/SOURCE.md)

## ローカルで見る

Node.js 24.3.0以上と、`packageManager`に指定したpnpm 11.21.0を使います。

```sh
pnpm install --frozen-lockfile
pnpm dev               # packageをビルドしてRemix playgroundを起動: http://localhost:5173
pnpm dev:reference     # 別ターミナルでshadcn参照画面を起動: http://localhost:5174
pnpm test:playground   # Remixのcontroller/SSRテスト
pnpm build:playground  # packageとplaygroundのアセットをビルド
pnpm start             # productionモードで起動
```

PlaygroundはRemixサーバーがHTMLをSSRし、ブラウザーで同じRemixコンポーネントをハイドレーションします。Playgroundで各部品、ライト／ダーク、会話のCompleted・Empty・Thinking・Error表示を切り替えられます。送信・停止・添付ボタンは表示確認用として無効化しています。入力・折りたたみ・コピー・末尾へのスクロールはブラウザー上で操作できます。

Introductionから公式一覧の21パターンへ移動できます。追加した16項目には、確認／復元のローカル状態、モデル選択、引用・Contextのポップアップ、ファイル選択、処理経過の表示例を含みます。開発中は既存の比較対象でローカルのReact参照画面、追加項目とIntroductionでは対応する公式ページを開きます。productionでは公式ページを開きます。

**AI接続・実際の送信・AIストリーミング・自動スクロール追従は未実装です。** 状態は固定データの表示例であり、実処理の成功・失敗を示しません。PlaygroundのアセットはRemixのサーバーからオンデマンドで配信されます。

## 構成

- `packages/remix-ai-elements` — `remix/component`と`css()`／`mix`で実装。React・Tailwind・AI SDKには依存しません。
- `examples/playground` — Remix版の表示カタログ。
- `examples/shadcn-reference` — 公式Base Rhea部品を保存した非公開React参照アプリ。取得元・スナップショットhash・ライセンスを記録しています。
- `examples/shared/fixtures.ts` — 両画面で使うサンプル会話。
- `.agents/skills/remix` — `remix@3.0.0`に対応する公式Skillを原文のまま収録。
- [Laravel Cloudへのデプロイ手順](docs/deployment.md) — 未デプロイのPlayground向け設定例。

新しい公式AI ElementsのBase版パターンを参照しています。旧AI ElementsのReactコードやSDK接続をそのままRemixへ持ち込む構成ではありません。

## 検証

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:consumer
```

`test:consumer`はビルド後のtarballを独立した一時ディレクトリにインストールし、公開exports・型宣言・SSR・React／Tailwind／AI SDK依存の不在を確認します。npmレジストリへのアクセスが必要です。公開操作は行いません。