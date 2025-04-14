// import { test, expect } from '@jest/globals';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { CdkProjectStack } from '../lib/cdk-project-stack';

test('S3 Bucket Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkProjectStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  // S3バケットが作成されていることを確認
  template.resourceCountIs('AWS::S3::Bucket', 1);

  // バケットの設定を確認
  template.hasResourceProperties('AWS::S3::Bucket', {
    VersioningConfiguration: {
      Status: 'Enabled',
    },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  });
});
