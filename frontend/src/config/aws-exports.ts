// AWS Cognito configuration
const awsExports = {
  "aws_project_region": process.env.AWS_REGION || 'ap-northeast-1',
  "aws_cognito_region": process.env.AWS_REGION || 'ap-northeast-1',
  "aws_user_pools_id": process.env.COGNITO_USER_POOL_ID || 'COGNITO_USER_POOL_ID',
  "aws_user_pools_web_client_id": process.env.COGNITO_CLIENT_ID || 'COGNITO_USER_POOL_WEB_CLIENT_ID',
};

export default awsExports;