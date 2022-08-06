# Via AWS SDK call

Introduced relatively recently, you can now _evaluate_ the [AWS AppSync](https://aws.amazon.com/appsync/) template via the AWS AppSync SDK call. This is my favorite method of testing the templates as it has a minimal dependency footprint.

> Note that the same command exists in the AWS CLI.

## To run the test

1. Make sure you have your AWS credentials set up.
1. Run `npm i`
1. Run `npm run test`
