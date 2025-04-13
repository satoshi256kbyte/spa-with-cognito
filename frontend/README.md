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
│   ├── config/         # 設定ファイル
│   │   └── aws-config.ts   # AWS Amplify設定
│   └── pages/          # ページコンポーネント
│       ├── Home.tsx    # ホームページ
│       └── Protected.tsx # 保護されたページ
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

### 2. AWS設定の更新

バックエンドをデプロイした後、CDKスタックの出力値を使用して `src/config/aws-config.ts` ファイルを更新します。

```typescript
export const awsConfig = {
  Auth: {
    region: 'ap-northeast-1', // あなたのAWSリージョン
    userPoolId: 'YOUR_USER_POOL_ID', // バックエンドデプロイ後の出力値
    userPoolWebClientId: 'YOUR_USER_POOL_CLIENT_ID', // バックエンドデプロイ後の出力値
    oauth: {
      domain: 'YOUR_COGNITO_DOMAIN', // バックエンドデプロイ後の出力値
      // ...その他の設定...
    }
  },
  API: {
    endpoints: [
      {
        name: 'mainApi',
        endpoint: 'YOUR_API_ENDPOINT', // バックエンドデプロイ後の出力値
        // ...その他の設定...
      },
      // ...その他のエンドポイント...
    ]
  }
};
```

以下の値を更新してください：
- `userPoolId`: Cognitoユーザープールの識別子
- `userPoolWebClientId`: ユーザープールクライアントの識別子
- `domain`: Cognitoのホストされたログインページのドメイン
- `endpoint`: API GatewayのエンドポイントURL

### 3. 開発サーバーの起動

ローカル開発サーバーを起動します：

```bash
npm start
```

アプリケーションは通常 http://localhost:3000 で実行されます。

## バックエンドとの連携

このフロントエンドアプリケーションは、バックエンドサービスと連携するように設計されています。主な連携ポイントは以下の通りです：

1. **認証**: AWS Amplifyを使用してCognitoユーザープールと連携し、認証機能を提供します。
2. **API呼び出し**: AWS Amplifyの`API`モジュールを使用して、保護されたAPIエンドポイントにリクエストを送信します。

例えば、保護されたリソースにアクセスするコードは以下のようになります：

```typescript
import { API } from 'aws-amplify';

// 保護されたリソースの取得
async function fetchProtectedResource() {
  try {
    const response = await API.get('mainApi', '/protected', {});
    return response;
  } catch (error) {
    console.error('Error fetching protected resource:', error);
    throw error;
  }
}
```

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
   - `aws-config.ts`の設定値が正しいことを確認
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
- 認証関連の処理は AWS Amplify の機能を利用

---

最終更新日: 2025年4月13日