// AWS Cognito configuration
const awsExports = {
  "aws_project_region": process.env.REACT_APP_AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-1',
  "aws_cognito_region": process.env.REACT_APP_AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-1',
  "aws_user_pools_id": process.env.REACT_APP_COGNITO_USER_POOL_ID || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'COGNITO_USER_POOL_ID',
  "aws_user_pools_web_client_id": process.env.REACT_APP_COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'COGNITO_USER_POOL_WEB_CLIENT_ID',
};

console.log('AWS Amplify configuration:', awsExports);
export default awsExports;