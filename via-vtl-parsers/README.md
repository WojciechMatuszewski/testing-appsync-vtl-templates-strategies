# Via VTL parsers

While one can run these tests in complete isolation (no AWS credentials are needed), you inherit two dependencies that AppSync uses internally.

I'm not a fan of this approach, as local simulation could, in theory, produce different results than the actual service. You also have to install additional dependencies that might or might not be well maintained.

## To run the test

1. Run `npm i`
1. Run `npm run test`
