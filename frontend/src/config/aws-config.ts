// AWS Amplify configuration for connecting to Cognito and API Gateway
export const awsConfig = {
  // These values will be populated from the AWS CloudFormation outputs after deployment
  Auth: {
    region: 'ap-northeast-1', // Update this to your AWS region
    userPoolId: 'YOUR_USER_POOL_ID', // This will be filled after deploying the backend
    userPoolWebClientId: 'YOUR_USER_POOL_CLIENT_ID', // This will be filled after deploying the backend
    oauth: {
      domain: 'YOUR_COGNITO_DOMAIN', // This will be filled after deploying the backend
      scope: ['openid'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code'
    }
  },
  API: {
    endpoints: [
      {
        name: 'mainApi',
        endpoint: 'YOUR_API_ENDPOINT', // This will be filled after deploying the backend
        region: 'ap-northeast-1' // Update this to your AWS region
      },
      {
        name: 'secondApi',
        endpoint: 'YOUR_SECOND_API_ENDPOINT', // This will be filled after deploying the backend
        region: 'ap-northeast-1' // Update this to your AWS region
      }
    ]
  }
};

/**
 * After deploying the backend with CDK, update this file with the output values
 * from the CloudFormation stack to connect your frontend to the backend services.
 */