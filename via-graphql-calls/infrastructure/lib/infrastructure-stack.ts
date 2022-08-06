import {
  aws_dynamodb,
  Stack,
  StackProps,
  custom_resources,
  aws_iam,
  CfnOutput,
  RemovalPolicy
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as aws_appsync from "@aws-cdk/aws-appsync-alpha";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new aws_dynamodb.Table(
      this,
      "AppSyncGraphQLCallsTestingTable",
      {
        partitionKey: {
          name: "id",
          type: aws_dynamodb.AttributeType.STRING
        },
        billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.DESTROY
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

    const api = new aws_appsync.GraphqlApi(
      this,
      "AppSyncGraphQLCallsTestingApi",
      {
        name: "AppSyncGraphQLCallsTestingApi",
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: aws_appsync.AuthorizationType.API_KEY
          }
        }
      }
    );

    const tableDataSource = api.addDynamoDbDataSource(
      "TableDataSource",
      table as any
    );

    const userType = new aws_appsync.ObjectType("User", {
      definition: {
        name: aws_appsync.GraphqlType.string({ isRequired: true }),
        id: aws_appsync.GraphqlType.id({ isRequired: true })
      }
    });

    const requestTemplate = `{
    "version": "2018-05-29",
    "operation": "GetItem",
    "key": {
        "id": $util.dynamodb.toDynamoDBJson($context.arguments.id)
    }
}`;
    const responseTemplate = `$util.toJson($context.result)`;

    const getUserQuery = new aws_appsync.ResolvableField({
      returnType: userType.attribute(),
      args: {
        id: aws_appsync.GraphqlType.id({ isRequired: true })
      },
      dataSource: tableDataSource,
      requestMappingTemplate:
        aws_appsync.MappingTemplate.fromString(requestTemplate),
      responseMappingTemplate:
        aws_appsync.MappingTemplate.fromString(responseTemplate)
    });

    api.addType(userType);
    api.addQuery("getUser", getUserQuery);

    new CfnOutput(this, "tableName", {
      value: table.tableName
    });

    new CfnOutput(this, "endpointUrl", {
      value: api.graphqlUrl
    });

    new CfnOutput(this, "endpointAPIkey", {
      value: api.apiKey ?? "NO_API_KEY"
    });
  }
}
