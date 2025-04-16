import * as cdk from 'aws-cdk-lib';
import * as httpApi from 'aws-cdk-lib/aws-apigatewayv2';
import * as httpApiAuthorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as httpApiIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
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
  corsOrigins?: string[];
  corsAllowCredentials?: boolean;
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

    // CORS設定 - 確実に動作する固定値を使用
    const corsOrigins = ['*']; // すべてのオリジンを許可
    const corsAllowCredentials = true;

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
        CORS_ORIGINS: JSON.stringify(corsOrigins),
        CORS_ALLOW_CREDENTIALS: corsAllowCredentials.toString(),
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
        CORS_ORIGINS: JSON.stringify(corsOrigins),
        CORS_ALLOW_CREDENTIALS: corsAllowCredentials.toString(),
      },
    });

    // HTTP API（APIGatewayV2）の作成 - ゲスト用
    const guestHttpApi = new httpApi.HttpApi(this, 'GuestHttpApi', {
      apiName: `${resourceBase}-apigw-http-guest-api`,
      description: `Guest HTTP API for ${serviceName} (${stageName}) - No authentication required`,
      corsPreflight: {
        allowOrigins: ['https://spa-with-cognito-frontend.vercel.app'], // フロントエンドのURLを明示的に指定
        allowMethods: [httpApi.CorsHttpMethod.ANY], // すべてのメソッドを許可
        allowHeaders: ['*'], // すべてのヘッダーを許可
        allowCredentials: true,
        maxAge: cdk.Duration.days(1), // プリフライト結果を長時間キャッシュ
      },
    });

    // Lambda 統合の作成 - ゲスト用
    const guestHttpIntegration = new httpApiIntegrations.HttpLambdaIntegration(
      'GuestHttpIntegration',
      guestApiFunction
    );

    // HTTP APIにエンドポイントを追加 - ゲスト用
    guestHttpApi.addRoutes({
      path: '/',
      methods: [httpApi.HttpMethod.GET],
      integration: guestHttpIntegration,
    });

    // HTTP APIにエンドポイントを追加 - ゲスト用情報エンドポイント
    guestHttpApi.addRoutes({
      path: '/info',
      methods: [httpApi.HttpMethod.GET],
      integration: guestHttpIntegration,
    });

    // HTTP API（APIGatewayV2）の作成 - メンバー用（CORS問題に対応）
    const memberHttpApi = new httpApi.HttpApi(this, 'MemberHttpApi', {
      apiName: `${resourceBase}-apigw-http-member-api`,
      description: `Member HTTP API for ${serviceName} (${stageName}) with Cognito authentication`,
      corsPreflight: {
        allowOrigins: ['https://spa-with-cognito-frontend.vercel.app'], // フロントエンドのURLを明示的に指定
        allowMethods: [httpApi.CorsHttpMethod.ANY], // すべてのメソッドを許可
        allowHeaders: ['*'], // すべてのヘッダーを許可
        allowCredentials: true,
        maxAge: cdk.Duration.days(1), // プリフライト結果を長時間キャッシュ
      },
    });

    // Cognito オーソライザーの設定
    const httpApiAuthorizer = new httpApiAuthorizers.HttpUserPoolAuthorizer(
      'MemberHttpApiAuthorizer',
      userPool,
      {
        userPoolClients: [userPoolClient],
        identitySource: ['$request.header.Authorization'],
      }
    );

    // Lambda 統合の作成 - メンバー用
    const memberHttpIntegration = new httpApiIntegrations.HttpLambdaIntegration(
      'MemberHttpIntegration',
      memberApiFunction
    );

    // HTTP APIにエンドポイントを追加 - メンバー用
    memberHttpApi.addRoutes({
      path: '/',
      methods: [httpApi.HttpMethod.GET],
      integration: memberHttpIntegration,
      authorizer: httpApiAuthorizer,
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

    // HTTP APIエンドポイントの出力 - ゲスト用
    new cdk.CfnOutput(this, 'GuestHttpApiEndpoint', {
      value: guestHttpApi.apiEndpoint,
      description: 'ゲスト用HTTP APIエンドポイント',
    });

    // HTTP APIエンドポイントの出力 - メンバー用
    new cdk.CfnOutput(this, 'MemberHttpApiEndpoint', {
      value: memberHttpApi.apiEndpoint,
      description: 'メンバー用HTTP APIエンドポイント（CORS対応）',
    });
  }
}
