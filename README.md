# sample-next-app

Next.js App Router + Stripe の決済フローを試せるサンプルです。

## セットアップ

1. 依存関係をインストール

```bash
pnpm install
```

2. 環境変数を用意

```bash
cp .env.local.example .env.local
```

` .env.local` に Stripe のキーを設定してください。

3. 開発サーバを起動

```bash
pnpm dev
```

`http://localhost:3000` を開いて確認します。

## よく使うコマンド

```bash
pnpm dev         # 開発サーバ
pnpm build       # 本番ビルド
pnpm start       # 本番ビルドを起動
pnpm lint        # ESLint
pnpm lint:fix    # ESLint 修正
pnpm format      # Prettier 書式
pnpm format:check # Prettier チェック
```

## 構成

```
src/
├── app/                    # App Router pages and layouts
├── components/
│   ├── ui/                # Reusable UI components
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── lib/                   # Utility functions and helpers
├── hooks/                 # Custom React hooks
├── services/              # API calls and external services
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
└── config/                # Configuration files
```

## 補足

- パスエイリアスは `@/*` が `src/*` を指します。
- 環境変数のテンプレートは `.env.local.example` にあります。
