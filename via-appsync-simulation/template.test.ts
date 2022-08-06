import { AppSyncUnitResolver } from "amplify-appsync-simulator/lib/resolvers";
import {
  AmplifyAppSyncSimulator,
  AmplifyAppSyncSimulatorAuthenticationType,
  RESOLVER_KIND
} from "amplify-appsync-simulator";
import fs from "fs";
import path from "path";

const outputsFilePath = path.join(__dirname, "./outputs.json");
const outputsFileContents = JSON.parse(
  fs.readFileSync(outputsFilePath, "utf8")
) as { [key: string]: { tableEndpoint: string; tableName: string } };

const { tableEndpoint, tableName } = Object.entries(
  outputsFileContents
)[0]?.[1] as {
  tableEndpoint: string;
  tableName: string;
};

test("template test", async () => {
  const simulator = new AmplifyAppSyncSimulator();
  simulator.init({
    dataSources: [
      {
        type: "AMAZON_DYNAMODB",
        name: "dynamodb",
        config: { tableName, endpoint: tableEndpoint }
      }
    ],
    appSync: {
      name: "testAppSyncAPI",
      additionalAuthenticationProviders: [],
      defaultAuthenticationType: {
        authenticationType: AmplifyAppSyncSimulatorAuthenticationType.API_KEY
      }
    },
    schema: {
      content: `
        schema {
          query: Query
        }

        type Query {
          getUser(id: ID!): User!
        }

        type User {
          id: ID!
          name: String!
        }
      `
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

  const resolver = new AppSyncUnitResolver(
    {
      requestMappingTemplate: requestTemplate,
      responseMappingTemplate: responseTemplate,
      kind: RESOLVER_KIND.UNIT,
      fieldName: "mockFieldName",
      typeName: "mockTypeName",
      dataSourceName: "dynamodb"
    },
    simulator
  );

  const result = await resolver.resolve(
    "SOURCE",
    { id: "USER_ID" },
    {
      appsyncErrors: []
    },
    {
      fieldNodes: []
    }
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "id": "USER_ID",
      "name": "CREATED_AT_INFRASTRUCTURE_DEPLOY_TIME",
    }
  `);
});
