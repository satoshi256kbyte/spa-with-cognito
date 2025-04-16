import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// ゲスト用ハンドラー（認証不要）
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<APIGatewayProxyResult> => {
  console.log('Guest Request: ', JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
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
