# SPA with AWS Cognito - モノレポ構成

このプロジェクトは AWS Cognito 認証を活用したシングルページアプリケーション (SPA) をモノレポ構成で実装したものです。

## ディレクトリ構造

```shell
├── package.json         # モノレポのルート package.json
├── frontend/            # フロントエンドアプリケーション
│   ├── package.json     # フロントエンドの依存関係
│   ├── public/          # 静的ファイル
│   └── src/             # ソースコード
│       ├── components/  # 再利用可能なコンポーネント
│       ├── pages/       # ページコンポーネント
│       └── context/     # Reactコンテキスト
└── backend/             # バックエンドアプリケーション
    ├── package.json     # バックエンドの依存関係
    ├── bin/             # CDKアプリケーションのエントリポイント
    ├── config/          # 環境別設定ファイル
    ├── lib/             # CDKスタック定義
    │   └── lambda-handler/ # Lambda関数のソースコード
    ├── src/             # ソースコード
    └── test/            # テストコード
```

## 開発環境のセットアップ

### 前提条件

以下のツールがインストールされていることを確認してください。

- asdf（Node.jsとnpmのバージョン管理）
- AWS CLI

### インストール

asdfを使用してNode.jsとnpmをインストールします。

```shell
asdf plugin add nodejs
asdf install
```

依存関係をインストールします。

```shell
# モノレポ全体の依存関係をインストール
npm run install:all
```

## デプロイ

バックエンドのデプロイ
AWS CDKを使用してバックエンドのリソース群をデプロイします。

```shell
npm run deploy:backend
```

本プロジェクトのフロントエンドはVercelでのデプロイを想定しています。
したがって、フロントエンドのデプロイコマンドはありません。

### Vercelへのデプロイ

- 本プロジェクトをGitHubにプッシュします。
- Vercelのプロジェクトを作成し、GitHubリポジトリを接続します。
- VercelのプロジェクトでSettingsを開き、設定を行います。
  - Root Directoryに`frontend`を指定します。
  - Environment Variablesで環境変数を設定します。

環境変数一覧
| 変数名 | 説明 |
| --- | --- |
| `REACT_APP_REGION` | AWSリージョン |
| `REACT_APP_USER_POOL_ID` | CognitoユーザープールID |
| `REACT_APP_USER_POOL_WEB_CLIENT_ID` | CognitoユーザープールクライアントID |
| `REACT_APP_API_GUEST` | 認証なしのバックエンドAPIのURL |
| `REACT_APP_API_MEMBER` | 認証ありのバックエンドAPIのURL |

## 開発

フロントエンド開発サーバーを起動するには、以下のコマンドを実行します。

```shell
npm run start:frontend
```

これにより、React開発サーバーが起動し、`http://localhost:3000` でアプリケーションにアクセスできます。

## フロントエンドのビルド

本番環境用にフロントエンドをビルドするには、以下のコマンドを実行します。

```shell
npm run build:frontend
```

ビルドされたファイルは `frontend/build` ディレクトリに出力されます。

## テスト

テストを実行するには、以下のコマンドを使用します。

```shell
# すべてのテストを実行
npm test

# フロントエンドのテストのみを実行
npm run test:frontend

# バックエンドのテストのみを実行
npm run test:backend
```
