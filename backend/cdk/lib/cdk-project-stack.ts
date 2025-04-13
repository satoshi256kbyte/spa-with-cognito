import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as nodejslambda from 'aws-cdk-lib/aws-lambda-nodejs';

// スタックプロパティの拡張インターフェース
interface CdkProjectStackProps extends cdk.StackProps {
  serviceName?: string;
  stageName?: string;
}

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CdkProjectStackProps) {
    super(scope, id, props);

    // サービス名とステージ名を取得（デフォルト値あり）
    const serviceName = props?.serviceName || 'spa-cognito';
    const stageName = props?.stageName || 'dev';
    
    // リソース名のベースを作成
    const resourceBase = `${serviceName}-${stageName}`;

    // S3バケットの作成
    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: `${resourceBase}-s3-main-assets`.toLowerCase(),
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    // Cognitoユーザープールの作成
    const userPool = new cognito.UserPool(this, 'SpaUserPool', {
      userPoolName: `${resourceBase}-cognito-user-pool`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ユーザープールドメインの設定
    const userPoolDomain = userPool.addDomain('SpaUserPoolDomain', {
      cognitoDomain: {
        domainPrefix: `${resourceBase}-auth-${this.account.substring(0, 8)}`.toLowerCase()
      }
    });

    // ユーザープールクライアントの作成
    const userPoolClient = new cognito.UserPoolClient(this, 'SpaUserPoolClient', {
      userPoolClientName: `${resourceBase}-cognito-client`,
      userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: ['http://localhost:3000'],
        logoutUrls: ['http://localhost:3000'],
      },
      preventUserExistenceErrors: true,
    });

    // API用のNodejsLambda関数を作成 - TypeScriptでコンパイル
    const apiFunction = new nodejslambda.NodejsFunction(this, 'ApiFunction', {
      functionName: `${resourceBase}-lambda-api-handler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../src/api-handler.ts'),
      handler: 'handler',
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: userPoolClient.userPoolClientId,
        SERVICE_NAME: serviceName,
        STAGE_NAME: stageName
      }
    });

    // 2つ目のAPI用NodejsLambda関数を作成 - TypeScriptでコンパイル
    const secondApiFunction = new nodejslambda.NodejsFunction(this, 'SecondApiFunction', {
      functionName: `${resourceBase}-lambda-second-api-handler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../src/api-handler.ts'),
      handler: 'handler',
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: userPoolClient.userPoolClientId,
        IS_SECONDARY_API: 'true',
        SERVICE_NAME: serviceName,
        STAGE_NAME: stageName
      }
    });

    // Cognitoオーソライザー
    const auth = new apigateway.CognitoUserPoolsAuthorizer(this, 'ApiAuthorizer', {
      authorizerName: `${resourceBase}-apigw-authorizer`,
      cognitoUserPools: [userPool],
      identitySource: 'method.request.header.Authorization',
    });

    // API Gateway REST APIの作成
    const api = new apigateway.RestApi(this, 'SpaApi', {
      restApiName: `${resourceBase}-apigw-main-api`,
      description: `API for ${serviceName} (${stageName}) with Cognito authentication`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // ルートリソースにGETメソッドを追加 (認証なし)
    api.root.addMethod('GET', new apigateway.LambdaIntegration(apiFunction));

    // 保護されたリソースの追加
    const protectedResource = api.root.addResource('protected');
    protectedResource.addMethod('GET', new apigateway.LambdaIntegration(apiFunction), {
      authorizer: auth,
      authorizationType: apigateway.AuthorizationType.COGNITO
    });

    // 2つ目のAPI Gateway REST APIの作成
    const secondApi = new apigateway.RestApi(this, 'SecondSpaApi', {
      restApiName: `${resourceBase}-apigw-second-api`,
      description: `Second API for ${serviceName} (${stageName}) with Cognito authentication`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // 2つ目のAPIのルートリソースにGETメソッドを追加 (認証なし)
    secondApi.root.addMethod('GET', new apigateway.LambdaIntegration(secondApiFunction));

    // 2つ目のAPIの保護されたリソースの追加
    const secondProtectedResource = secondApi.root.addResource('protected');
    secondProtectedResource.addMethod('GET', new apigateway.LambdaIntegration(secondApiFunction), {
      authorizer: auth,
      authorizationType: apigateway.AuthorizationType.COGNITO
    });

    // 出力の定義
    new cdk.CfnOutput(this, 'ServiceName', {
      value: serviceName,
      description: 'サービス名'
    });

    new cdk.CfnOutput(this, 'StageName', {
      value: stageName,
      description: 'ステージ名'
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: '作成されたS3バケットの名前'
    });

    // Cognito出力の定義
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: '作成されたCognitoユーザープールのID'
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: '作成されたCognitoユーザープールクライアントのID'
    });

    new cdk.CfnOutput(this, 'UserPoolDomain', {
      value: userPoolDomain.domainName,
      description: 'Cognitoユーザープールのドメイン'
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API GatewayのエンドポイントURL'
    });

    new cdk.CfnOutput(this, 'ProtectedEndpoint', {
      value: `${api.url}protected`,
      description: 'Cognito認証で保護されたAPI GatewayのエンドポイントURL'
    });

    // 2つ目のAPIの出力
    new cdk.CfnOutput(this, 'SecondApiEndpoint', {
      value: secondApi.url,
      description: '2つ目のAPI GatewayのエンドポイントURL'
    });

    new cdk.CfnOutput(this, 'SecondProtectedEndpoint', {
      value: `${secondApi.url}protected`,
      description: '2つ目のCognito認証で保護されたAPI GatewayのエンドポイントURL'
    });
  }
}
