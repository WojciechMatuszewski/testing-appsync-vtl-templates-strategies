# Via GraphQL calls to the API

Here, we do not rely on any "local" AppSync dependencies. Instead, we exercise the whole system, starting from a GraphQL request. These tests represent the reality the most and will give you the most confidence in your system working as expected.

The caveat is that to run them, you have to have most, if not all, infrastructure in place.

## To run the test

1. Make sure you have your AWS credentials set up.
1. Run `npm i`
1. Run `npm run bootstrap`
1. Run `npm run deploy`
1. Run `npm run test`
