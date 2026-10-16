# remix-ai-elements

shadcn AI Elementsを参考にした、Remix v3ネイティブのnpmコンポーネント集です。現在は**見た目を確認する初期実装**で、npmには未公開です。

- [設計・実装方針](docs/design.md) — AI SDK接続など、今後の全体設計
- [表示部品の使い方](packages/remix-ai-elements/README.md)
- [公式Remix 3 Skill](.agents/skills/remix/SKILL.md) / [取得元・バージョン](.agents/skills/remix/SOURCE.md)

## ローカルで見る

Node.js 24と、`packageManager`に指定したpnpmを使います。

```sh
pnpm install --frozen-lockfile
pnpm dev            # Remix playground: http://localhost:5173
pnpm dev:reference  # 別ターミナルでshadcn参照画面: http://localhost:5174
```

Playgroundで各部品、ライト／ダーク、会話のCompleted・Empty・Thinking・Error表示を切り替えられます。送信・停止・添付ボタンは表示確認用として無効化しています。入力・折りたたみ・コピー・末尾へのスクロールはブラウザー上で操作できます。

**AI接続・実際の送信・ストリーミング・自動スクロール追従は未実装です。** 状態は固定データの表示例であり、実処理の成功・失敗を示しません。PlaygroundはブラウザーでマウントするViteアプリです。部品のSSRはテスト対象ですが、アプリのSSR／ハイドレーション経路は今回の範囲外です。

## 構成

- `packages/remix-ai-elements` — `remix/component`と`css()`／`mix`で実装。React・Tailwind・AI SDKには依存しません。
- `examples/playground` — Remix版の表示カタログ。
- `examples/shadcn-reference` — 公式Base Rhea部品を保存した非公開React参照アプリ。取得元・スナップショットhash・ライセンスを記録しています。
- `examples/shared/fixtures.ts` — 両画面で使うサンプル会話。
- `.agents/skills/remix` — `remix@3.0.0`に対応する公式Skillを原文のまま収録。

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