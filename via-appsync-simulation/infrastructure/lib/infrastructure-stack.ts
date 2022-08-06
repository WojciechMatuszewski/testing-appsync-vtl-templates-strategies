import {
  aws_dynamodb,
  Stack,
  StackProps,
  custom_resources,
  aws_iam,
  CfnOutput
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new aws_dynamodb.Table(
      this,
      "AppSyncSimulationTestingTable",
      {
        partitionKey: {
          name: "id",
          type: aws_dynamodb.AttributeType.STRING
        },
        billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST
      }
    );

    new custom_resources.AwsCustomResource(
      this,
      "CreateDynamodbTestUserResource",
      {
        onCreate: {
          service: "DynamoDB",
          action: "putItem",
          parameters: {
            TableName: table.tableName,
            Item: {
              id: {
                S: "USER_ID"
              },
              name: {
                S: "CREATED_AT_INFRASTRUCTURE_DEPLOY_TIME"
              }
            }
          },
          physicalResourceId: custom_resources.PhysicalResourceId.of("INIT")
        },
        onDelete: {
          service: "dynamodb",
          action: "deleteItem",
          parameters: {
            TableName: table.tableName,
            Key: {
              id: {
                S: "USER_ID"
              }
            }
          }
        },
        policy: custom_resources.AwsCustomResourcePolicy.fromStatements([
          new aws_iam.PolicyStatement({
            effect: aws_iam.Effect.ALLOW,
            actions: ["dynamodb:PutItem", "dynamodb:DeleteItem"],
            resources: [table.tableArn]
          })
        ])
      }
    );

    new CfnOutput(this, "tableName", {
      value: table.tableName
    });

    new CfnOutput(this, "tableEndpoint", {
      value: `dynamodb.${this.region}.amazonaws.com`
    });
  }
}
