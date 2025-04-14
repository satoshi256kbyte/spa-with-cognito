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

### Cognitoユーザープールドメインの設定

このプロジェクトでは、CDKデプロイ後に**AWSコンソールから手動で**Cognitoユーザープールドメインを設定する必要があります。これはホスト型UI（Cognitoの標準ログイン画面）を使用するために必要なステップです。

設定後のドメインURLは `https://[プレフィックス].auth.[リージョン].amazoncognito.com` の形式になります。
このドメインURLはフロントエンドの設定ファイルにも追加する必要があります。

#### ドメイン設定後のフロントエンド設定

ドメインを設定した後、フロントエンドの設定ファイル `frontend/src/config/aws-config.ts` に以下の情報を追加してください：

```typescript
// frontend/src/config/aws-config.ts の例
export const awsConfig = {
  region: 'ap-northeast-1', // AWSリージョン
  userPoolId: 'ap-northeast-1_xxxxxxxxx', // デプロイ後に出力されたユーザープールID
  userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx', // デプロイ後に出力されたクライアントID
  oauth: {
    domain: 'your-domain-prefix.auth.ap-northeast-1.amazoncognito.com', // 手動で設定したドメイン
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: 'http://localhost:3000/',
    redirectSignOut: 'http://localhost:3000/',
    responseType: 'code',
  },
};
```

注意：ドメイン設定はCDKで自動化することも技術的には可能ですが、名前の一意性などの問題によりデプロイが失敗することがあるため、本プロジェクトでは手動設定を採用しています。

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
    ├── package.json     # バックエンドの依存関係
    ├── bin/             # CDKアプリケーションのエントリーポイント
    ├── lib/             # CDKスタック定義
    │   └── lambda-handler/ # Lambda関数のソースコード
    └── test/            # テストコード
```
