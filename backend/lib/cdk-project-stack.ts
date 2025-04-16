import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejslambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

// スタックプロパティの拡張インターフェース
interface CdkProjectStackProps extends cdk.StackProps {
  serviceName?: string;
  stageName?: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CdkProjectStackProps) {
    super(scope, id, props);

    const serviceName =
      this.node.tryGetContext('serviceName') || props?.serviceName || 'spa-cognito';
    const stageName = this.node.tryGetContext('stageName') || props?.stageName || 'dev';

    // コールバックURLとログアウトURLをcontextから取得（配列の場合はそのまま使用、文字列の場合は分割）
    const contextCallbackUrls = this.node.tryGetContext('callbackUrls');
    const contextLogoutUrls = this.node.tryGetContext('logoutUrls');

    const callbackUrlsFromContext = Array.isArray(contextCallbackUrls)
      ? contextCallbackUrls
      : typeof contextCallbackUrls === 'string'
        ? contextCallbackUrls.split(',')
        : undefined;

    const logoutUrlsFromContext = Array.isArray(contextLogoutUrls)
      ? contextLogoutUrls
      : typeof contextLogoutUrls === 'string'
        ? contextLogoutUrls.split(',')
        : undefined;

    // 優先順位: Context > Props > デフォルト値
    const callbackUrls = callbackUrlsFromContext ||
      props?.callbackUrls || ['http://localhost:3000'];
    const logoutUrls = logoutUrlsFromContext || props?.logoutUrls || ['http://localhost:3000'];

    // リソース名のベースを作成
    const resourceBase = `${serviceName}-${stageName}`;

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
        callbackUrls: callbackUrls,
        logoutUrls: logoutUrls,
      },
      preventUserExistenceErrors: true,
    });

    const guestApiFunction = new nodejslambda.NodejsFunction(this, 'GuestApiFunction', {
      functionName: `${resourceBase}-lambda-guest-api-handler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: 'lib/lambda-handler/guest-handler.ts',
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: userPoolClient.userPoolClientId,
        SERVICE_NAME: serviceName,
        STAGE_NAME: stageName,
      },
    });

    const memberApiFunction = new nodejslambda.NodejsFunction(this, 'MemberApiFunction', {
      functionName: `${resourceBase}-lambda-member-api-handler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: 'lib/lambda-handler/member-handler.ts',
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: userPoolClient.userPoolClientId,
        SERVICE_NAME: serviceName,
        STAGE_NAME: stageName,
      },
    });

    // ゲスト用のAPI Gateway REST APIの作成
    const guestApi = new apigateway.RestApi(this, 'GuestApi', {
      restApiName: `${resourceBase}-apigw-guest-api`,
      description: `Guest API for ${serviceName} (${stageName}) - No authentication required`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // ルートリソースにGETメソッドを追加 (認証なし)
    guestApi.root.addMethod('GET', new apigateway.LambdaIntegration(guestApiFunction));

    // メンバー用のAPI Gateway REST APIの作成
    const memberApi = new apigateway.RestApi(this, 'MemberApi', {
      restApiName: `${resourceBase}-apigw-member-api`,
      description: `Member API for ${serviceName} (${stageName}) with Cognito authentication`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // メンバーAPI用のオーソライザーを作成（同じユーザープールを使用）
    const memberApiAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'MemberApiAuthorizer',
      {
        authorizerName: `${resourceBase}-apigw-member-authorizer`,
        cognitoUserPools: [userPool],
        identitySource: 'method.request.header.Authorization',
      }
    );

    // メンバーAPIのルートリソースにGETメソッドを追加 (認証あり)
    memberApi.root.addMethod('GET', new apigateway.LambdaIntegration(memberApiFunction), {
      authorizer: memberApiAuthorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // 出力の定義
    new cdk.CfnOutput(this, 'ServiceName', {
      value: serviceName,
      description: 'サービス名',
    });

    new cdk.CfnOutput(this, 'StageName', {
      value: stageName,
      description: 'ステージ名',
    });

    // Cognito出力の定義
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: '作成されたCognitoユーザープールのID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: '作成されたCognitoユーザープールクライアントのID',
    });

    new cdk.CfnOutput(this, 'GuestApiEndpoint', {
      value: guestApi.url,
      description: 'ゲスト用APIエンドポイント（認証不要）',
    });

    new cdk.CfnOutput(this, 'GuestInfoEndpoint', {
      value: `${guestApi.url}info`,
      description: 'ゲストAPI情報エンドポイント（認証不要）',
    });

    // 2つ目のAPIの出力
    new cdk.CfnOutput(this, 'MemberApiEndpoint', {
      value: memberApi.url,
      description: 'メンバー用APIエンドポイント',
    });
  }
}
