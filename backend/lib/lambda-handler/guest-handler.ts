import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<APIGatewayProxyResult> => {
  console.log('Guest Request: ', JSON.stringify(event, null, 2));

  // Extract origin from request headers
  const origin = event.headers.origin || event.headers.Origin;

  // 固定CORS設定 - 最も寛容な設定
  const allowedOrigin = origin || '*'; // オリジンをそのまま返すか、ワイルドカード

  // CORSヘッダーの設定 - あらゆるリクエストを許可
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24時間キャッシュ
  };

  // OPTIONSリクエスト（プリフライトリクエスト）に対する処理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      message: 'こんにちは、ゲストさん！',
      timestamp: new Date().toISOString(),
      path: event.path,
      publicData: {
        appInfo: '認証なしでアクセスできる公開情報です',
        status: 'active',
      },
    }),
  };
};
