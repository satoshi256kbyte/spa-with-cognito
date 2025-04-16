import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// メンバー用ハンドラー（認証必要）
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<APIGatewayProxyResult> => {
  console.log('Member Request: ', JSON.stringify(event, null, 2));

  // Cognitoからの認証情報を取得
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.['sub'];
  const email = claims?.['email'];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify({
      message: 'ようこそ、メンバーさん！',
      userId: userId,
      email: email,
      timestamp: new Date().toISOString(),
      memberData: {
        role: 'member',
        accessLevel: 'standard',
        lastLogin: new Date().toISOString(),
      },
    }),
  };
};
