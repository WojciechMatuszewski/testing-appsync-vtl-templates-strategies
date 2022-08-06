# Via AppSync simulation

Here, instead of asserting on a parsed template, we make the request to the actual _data source_. This type of testing is a bit more involved as it requires infrastructure to be in place. On the flip side, you gain a lot of confidence that the template is working as expected.

## To run the test

1. Make sure you have your AWS credentials set up.
1. Run `npm i`
1. Run `npm run bootstrap`
1. Run `npm run deploy`
1. Run `npm run test`
