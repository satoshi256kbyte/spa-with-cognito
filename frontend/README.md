# フロントエンドアプリケーション for SPA with Cognito

このディレクトリには、AWS Cognitoによる認証機能を持つSPAのフロントエンドアプリケーションが含まれています。

## ディレクトリ構成

```
frontend/
├── public/             # 静的アセット
│   ├── index.html      # メインHTMLファイル
│   └── manifest.json   # PWAマニフェスト
├── src/                # ソースコード
│   ├── App.tsx         # アプリケーションのルートコンポーネント
│   ├── index.tsx       # エントリーポイント
│   ├── components/     # 再利用可能なコンポーネント
│   │   └── Navigation.tsx  # ナビゲーションコンポーネント
│   ├── context/        # Reactコンテキスト
│   └── pages/          # ページコンポーネント
│       ├── Home.tsx    # ホームページ
│       ├── About.tsx   # アバウトページ
│       └─── Member.tsx  # メンバーページ
├── package.json        # 依存関係と設定
├── tsconfig.json       # TypeScript設定
└── README.md           # このファイル
```

## 開発環境のセットアップ

### 前提条件

- [Node.js](https://nodejs.org/) (バージョン14以上)
- バックエンドが既にデプロイされていること

### 1. 依存関係のインストール

フロントエンドディレクトリに移動し、依存関係をインストールします：

```bash
cd frontend
npm install
```

### 2. 開発サーバーの起動

ローカル開発サーバーを起動します：

```bash
npm start
```

アプリケーションは通常 http://localhost:3000 で実行されます。

## バックエンドとの連携

このフロントエンドアプリケーションは、バックエンドサービスと連携するように設計されています。主な連携ポイントは以下の通りです：

1. **認証**: AWS Cognitoによる認証機能を提供します。
2. **API呼び出し**: バックエンドAPIエンドポイントにリクエストを送信します。

## ビルドとデプロイ

### プロダクションビルドの作成

```bash
npm run build
```

このコマンドは `build` ディレクトリに最適化されたプロダクションビルドを生成します。

### デプロイ方法

ビルドしたアプリケーションは、任意のホスティングサービスにデプロイできます：

#### AWS S3 + CloudFrontによるデプロイ（推奨）

1. S3バケットの作成と設定：

```bash
aws s3 mb s3://your-app-bucket-name
aws s3 website s3://your-app-bucket-name --index-document index.html --error-document index.html
```

2. ビルドファイルのアップロード：

```bash
aws s3 sync build/ s3://your-app-bucket-name --acl public-read
```

3. 必要に応じてCloudFrontディストリビューションを設定

#### その他のデプロイオプション

- GitHub Pages
- Netlify
- Vercel
- AWS Amplify Hosting

## トラブルシューティング

### よくある問題と解決策

1. **認証エラー**:

   - バックエンドが正しくデプロイされていることを確認
   - 認証設定が正しいことを確認
   - Cognitoユーザープールのアプリクライアント設定でコールバックURLが正確に設定されていることを確認

2. **API呼び出しエラー**:

   - APIエンドポイントURLが正しいことを確認
   - 認証が正常に行われていることを確認
   - CORSが適切に設定されていることを確認

3. **ビルドエラー**:
   - 依存関係が正しくインストールされていることを確認
   - TypeScriptエラーを修正
   - Node.jsのバージョンを確認

## 開発ガイドライン

### コードスタイル

このプロジェクトはTypeScriptとモダンなReactパターンを使用しています：

- 関数コンポーネントとReact Hooksを優先
- タイプセーフなコーディング
- コンポーネントの分割と再利用

### ファイル構成

- 新しいページは `src/pages` ディレクトリに追加
- 共通コンポーネントは `src/components` ディレクトリに追加
- 認証関連の処理は適切な認証メカニズムを利用

---

最終更新日: 2025年4月16日
