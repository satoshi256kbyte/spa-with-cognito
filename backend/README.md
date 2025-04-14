# Backend Service for SPA with Cognito

このディレクトリには、AWS Cognitoによる認証機能を持つSPAのバックエンドサービスが含まれています。

## ディレクトリ構成

```
backend/
├── bin/                # CDKアプリケーションのエントリポイント
│   └── cdk-project.ts  # CDKアプリのメインエントリポイント
├── lib/                # CDKスタック定義
│   ├── cdk-project-stack.ts  # メインCDKスタック
│   └── lambda-handler/ # Lambda関数のソースコード
│       └── api-handler.ts    # APIハンドラー関数
├── test/               # テストコード
│   └── cdk-project.test.ts
└── README.md           # このファイル
```

## デプロイ方法

### 前提条件

- [Node.js](https://nodejs.org/) (バージョン14以上)
- [AWS CLI](https://aws.amazon.com/cli/)がインストールされ、設定済み
- [AWS CDK](https://aws.amazon.com/cdk/)がインストール済み

### 1. AWS CLIの設定

AWSアカウントにアクセスするための認証情報を設定します：

```bash
aws configure
```

必要に応じてAWSアクセスキー、シークレットアクセスキー、リージョン、出力形式を入力します。

### 2. 依存関係のインストール

CDKディレクトリに移動し、依存関係をインストールします：

```bash
cd cdk
npm install
```

### 3. CDKブートストラップ（初回のみ）

AWS環境にCDKを初めてデプロイする場合は、ブートストラップが必要です：

```bash
npx cdk bootstrap
```

### 4. デプロイ

CDKスタックをデプロイします：

```bash
# デフォルト値（serviceName='spa-cognito', stageName='dev'）を使用する場合
npx cdk deploy

# カスタムのサービス名とステージ名を指定する場合
npx cdk deploy -c service-name=my-spa -c stage-name=prod
```

このコマンドは、CloudFormationスタックを使用してすべてのリソースをAWSにデプロイします。
各リソースは `{ServiceName}-{StageName}-AWSサービス名-リソース名` の命名規則で作成されます。
例えば、prod環境のCognitoユーザープールは `my-spa-prod-cognito-user-pool` のような名前になります。

これらの値は、フロントエンドアプリケーションの設定に使用します。

### 5. スタックの削除（不要になった場合）

リソースを削除するには：

```bash
npx cdk destroy
```

## 開発環境のセットアップ

### Lambda関数のローカルテスト

Lambda関数をローカルでテストするには：

1. APIハンドラーファイルのある場所に移動：

```bash
cd src
```

2. Node.jsのREPLでテスト：

```bash
node
> const handler = require('./api-handler');
> handler.lambdaHandler({}, {});
```

または、イベントオブジェクトをJSONファイルに保存し、AWS SAM CLIを使用してテストすることも可能です。

### CDKの開発

CDKコードの開発中は、変更を監視して自動的にコンパイルすることができます：

```bash
cd cdk
npm run watch
```

また、変更を適用する前にスタックの差分を確認することをお勧めします：

```bash
npx cdk diff
```

## トラブルシューティング

デプロイ中に問題が発生した場合：

1. AWS CloudFormationコンソールでスタックの状態を確認
2. AWS管理コンソールのCloudWatch Logsでエラーログを確認
3. 正しいAWSプロファイルとリージョンが設定されていることを確認

CDKのバージョンに関連する問題が発生した場合は、グローバルとローカルのCDKバージョンが互換性があることを確認してください。
