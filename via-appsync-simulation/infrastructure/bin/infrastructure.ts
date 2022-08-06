import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";

const app = new cdk.App();
new InfrastructureStack(app, "AppSyncSimulationTestingStack", {
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: "appsyncsim"
  })
});
