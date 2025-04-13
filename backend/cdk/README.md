# AWS CDK Project

This project is an AWS Cloud Development Kit (CDK) application that defines and deploys cloud resources using TypeScript.

## Project Structure

- **bin/cdk-project.ts**: Entry point for the AWS CDK application. Initializes the CDK app and defines the stack to be deployed.
- **lib/cdk-project-stack.ts**: Contains the `CdkProjectStack` class which extends the Stack class from the AWS CDK. This file defines the resources to be created in the stack.
- **test/cdk-project.test.ts**: Contains unit tests for the `CdkProjectStack`. It uses the AWS CDK assertions library to verify that the stack is created as expected.
- **package.json**: Configuration file for npm, listing dependencies, scripts, and metadata for the project.
- **cdk.json**: Configuration settings for the AWS CDK, including the app entry point and context values.
- **tsconfig.json**: Configuration file for TypeScript, specifying compiler options and files to include in the compilation.

## Setup Instructions

1. **Install Dependencies**: Run the following command to install the necessary dependencies:

   ```
   npm install
   ```

2. **Deploy the Stack**: Use the following command to deploy the stack to your AWS account:

   ```
   cdk deploy
   ```

3. **Run Tests**: To execute the unit tests, run:
   ```
   npm test
   ```

## Usage

After deploying the stack, you can manage the resources defined in the `CdkProjectStack` through the AWS Management Console or using the AWS CLI.

For more information on AWS CDK, visit the [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html).
