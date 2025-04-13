# SPA with AWS Cognito - モノレポ構成

このプロジェクトは AWS Cognito 認証を活用したシングルページアプリケーション (SPA) をモノレポ構成で実装したものです。

## プロジェクト構成

このリポジトリはフロントエンドとバックエンドのコードを1つのリポジトリで管理するモノレポ構成になっています：

- `/frontend` - React + TypeScript で実装されたSPAフロントエンド
- `/backend` - AWS CDK で実装されたバックエンドインフラストラクチャ

## 開発環境のセットアップ

### 前提条件

- Node.js (v16以上)
- npm (v7以上)
- AWS CLI（設定済み）
- AWS CDK CLI

### インストール

リポジトリのルートディレクトリで以下のコマンドを実行します：

```bash
# モノレポ全体の依存関係をインストール
npm run install:all
```

または、個別のパッケージをインストールする場合：

```bash
# フロントエンドの依存関係のみをインストール
npm run install:frontend

# バックエンドの依存関係のみをインストール
npm run install:backend
```

## バックエンドのデプロイ

AWS CDKを使用してバックエンドリソースをデプロイします：

```bash
npm run deploy:backend
```

デプロイが完了すると、以下の情報が出力されます：
- Cognito ユーザープールID
- Cognito クライアントID
- API Gateway エンドポイント

これらの値を `frontend/src/config/aws-config.ts` ファイルに設定する必要があります。

## フロントエンドの開発

フロントエンド開発サーバーを起動するには：

```bash
npm run start:frontend
```

これにより、React開発サーバーが起動し、`http://localhost:3000` でアプリケーションにアクセスできます。

## フロントエンドのビルド

本番環境用にフロントエンドをビルドするには：

```bash
npm run build:frontend
```

ビルドされたファイルは `frontend/build` ディレクトリに出力されます。

## テスト

テストを実行するには：

```bash
# すべてのテストを実行
npm test

# フロントエンドのテストのみを実行
npm run test:frontend

# バックエンドのテストのみを実行
npm run test:backend
```

## 本番環境へのデプロイ

1. バックエンドをデプロイする
2. フロントエンドをビルドする
3. ビルドされたフロントエンドファイルをS3バケットにアップロードする（必要に応じてCloudFrontを設定）

## ディレクトリ構造

```
├── package.json         # モノレポのルート package.json
├── frontend/            # フロントエンドアプリケーション
│   ├── package.json     # フロントエンドの依存関係
│   ├── public/          # 静的ファイル
│   └── src/             # ソースコード
│       ├── components/  # 再利用可能なコンポーネント
│       ├── pages/       # ページコンポーネント
│       └── config/      # アプリケーションの設定
└── backend/             # バックエンドアプリケーション
    ├── cdk/             # CDKプロジェクト
    │   ├── lib/         # CDKスタック定義
    │   └── bin/         # CDKエントリーポイント
    └── src/             # Lambda関数ソースコード
```

---

最終更新日: 2025年4月13日