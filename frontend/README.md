# フロントエンドアプリケーション for SPA with Cognito

このディレクトリには、AWS Cognitoによる認証機能を持つSPAのフロントエンドアプリケーションが含まれています。

## ディレクトリ構成

```
frontend/
├── build/              # ビルド出力ディレクトリ
│   ├── static/         # ビルドされた静的ファイル
│   └── index.html      # ビルドされたHTML
├── docs/               # ドキュメント
│   └── design.md       # 設計ドキュメント
├── public/             # 静的アセット
│   ├── index.html      # メインHTMLファイル
│   └── manifest.json   # PWAマニフェスト
├── src/                # ソースコード
│   ├── App.tsx         # アプリケーションのルートコンポーネント
│   ├── index.tsx       # エントリポイント
│   ├── components/     # 再利用可能なコンポーネント
│   │   └── Navigation.tsx  # ナビゲーションコンポーネント
│   ├── context/        # Reactコンテキスト
│   └── pages/          # ページコンポーネント
│       ├── Home.tsx    # ホームページ
│       ├── About.tsx   # アバウトページ
│       └── Member.tsx  # メンバーページ
├── package.json        # 依存関係と設定
├── tsconfig.json       # TypeScript設定
└── README.md           # このファイル
```

## 開発環境のセットアップ

### 前提条件

以下のツールがインストールされていることを確認してください。

- asdf（Node.jsとnpmのバージョン管理）

### インストール

asdfを使用してNode.jsとnpmをインストールします。

```shell
asdf plugin add nodejs
asdf install
```

依存関係をインストールします。

```shell
npm install
```

## ビルド

```shell
npm run build
```

このコマンドは `build` ディレクトリに最適化されたプロダクションビルドを生成します。

## 開発

ローカル開発サーバーを起動します：

```shell
npm start
```

アプリケーションは通常 http://localhost:3000 で実行されます。
