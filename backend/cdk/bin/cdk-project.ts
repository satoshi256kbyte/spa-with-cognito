#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkProjectStack } from '../lib/cdk-project-stack';

const app = new cdk.App();

// コマンドラインからパラメータを取得
const serviceName = app.node.tryGetContext('service-name') || 'spa-cognito';
const stageName = app.node.tryGetContext('stage-name') || 'dev';

new CdkProjectStack(app, `${serviceName}-${stageName}-stack`, {
  /* スタックに追加のプロパティがある場合はここに記述します */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  // カスタムプロパティとしてサービス名とステージ名を渡す
  tags: {
    Service: serviceName,
    Stage: stageName,
  },
  // stackNameとしてもサービス名とステージ名を使用
  stackName: `${serviceName}-${stageName}-stack`,

  // スタックにカスタムプロパティを追加
  serviceName: serviceName,
  stageName: stageName,
});
