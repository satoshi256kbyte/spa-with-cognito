# Backend Service for SPA with Cognito

このディレクトリには、AWS Cognitoによる認証機能を持つSPAのバックエンドサービスが含まれています。

## ディレクトリ構成

```
backend/
├── bin/                # CDKアプリケーションのエントリポイント
│   └── cdk-project.ts  # CDKアプリのメインエントリポイント
├── cdk.out/            # CDKビルド出力ディレクトリ
├── config/             # 環境別設定ファイル
│   ├── dev.json.sample  # 開発環境の設定テンプレート
│   └── prod.json.sample # 本番環境の設定テンプレート
├── lib/                # CDKスタック定義
│   ├── cdk-project-stack.ts  # メインCDKスタック
│   └── lambda-handler/ # Lambda関数のソースコード
├── src/                # ソースコード
├── test/               # テストコード
│   └── cdk-project.test.ts
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

## デプロイ

### CDKブートストラップ（初回のみ）

AWS環境にCDKを初めてデプロイする場合は、ブートストラップが必要です

```shell
npx cdk bootstrap
```

### 環境設定ファイルの準備

環境設定ファイルをサンプルからコピーして作成します

```shell
cp config/dev.json.sample config/dev.json
```

設定ファイルは必要に応じて編集してください

### デプロイ

CDKスタックをデプロイします

```shell
# 開発環境（dev）の設定を使用してデプロイする場合
npx cdk deploy -c env=dev
```

### スタックの削除（不要になった場合）

```shell
npx cdk destroy -c env=dev
```
