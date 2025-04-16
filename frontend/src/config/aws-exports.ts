// AWS Cognito configuration
const awsExports = {
  "aws_project_region": "ap-northeast-1", // デフォルトでは東京リージョン
  "aws_cognito_region": "ap-northeast-1", // デフォルトでは東京リージョン
  "aws_user_pools_id": "COGNITO_USER_POOL_ID", // CDKデプロイ後に出力されたユーザープールID
  "aws_user_pools_web_client_id": "COGNITO_USER_POOL_WEB_CLIENT_ID", // CDKデプロイ後に出力されたクライアントID
  
  // ホスト型UIを使用する場合は、以下のoauth設定も追加してください
  // "oauth": {
  //   "domain": "your-domain-prefix.auth.ap-northeast-1.amazoncognito.com",
  //   "scope": ["email", "openid", "profile"],
  //   "redirectSignIn": "http://localhost:3000/",
  //   "redirectSignOut": "http://localhost:3000/",
  //   "responseType": "code"
  // }
};

export default awsExports;