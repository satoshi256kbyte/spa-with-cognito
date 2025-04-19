#!/usr/bin/env node
import 'source-map-support/register';
import * as fs from 'fs';
import * as path from 'path';

import * as cdk from 'aws-cdk-lib';

import { CdkProjectStack } from '../lib/cdk-project-stack';

const app = new cdk.App();

// 環境設定の読み込み
// コマンドラインまたはデフォルトで環境を決定
const envName = app.node.tryGetContext('env') || 'dev';

// 設定ファイルのパスを構築
const configPath = path.join(__dirname, '..', 'config', `${envName}.json`);

// 設定ファイルが存在するか確認
if (!fs.existsSync(configPath)) {
  throw new Error(`設定ファイルが見つかりません: ${configPath}`);
}

// 設定ファイルを読み込む
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 設定から必要なパラメータを取得
const serviceName = config.serviceName || 'spa-cognito';
const stageName = config.stageName || envName;
const callbackUrls = config.callbackUrls || ['http://localhost:3000'];
const logoutUrls = config.logoutUrls || ['http://localhost:3000'];
const corsOrigins = config.corsOrigins || ['*'];
const corsAllowCredentials = config.corsAllowCredentials || true;

// スタックの作成
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
  callbackUrls: callbackUrls,
  logoutUrls: logoutUrls,
  corsOrigins: corsOrigins,
  corsAllowCredentials: corsAllowCredentials,
});
