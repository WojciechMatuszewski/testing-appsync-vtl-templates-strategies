import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";

const app = new cdk.App();
new InfrastructureStack(app, "AppSyncGraphQLCallsTestingStack", {
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: "appsyncgql"
  })
});
