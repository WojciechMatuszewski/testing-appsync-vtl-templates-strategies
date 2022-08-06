import {
  AppSyncClient,
  EvaluateMappingTemplateCommand
} from "@aws-sdk/client-appsync";

const client = new AppSyncClient({});

test("template test", async () => {
  const template = `{
    "version": "2018-05-29",
    "operation": "GetItem",
    "key": {
        "id": $util.dynamodb.toDynamoDBJson($context.arguments.id),
    }
}`;
  const context = JSON.stringify({ arguments: { id: "USER_ID" } });

  const templateEvaluationResult = await client.send(
    new EvaluateMappingTemplateCommand({
      template,
      context
    })
  );

  expect(templateEvaluationResult.evaluationResult).toMatchInlineSnapshot(`
    "{
        \\"version\\": \\"2018-05-29\\",
        \\"operation\\": \\"GetItem\\",
        \\"key\\": {
            \\"id\\": {\\"S\\":\\"USER_ID\\"},
        }
    }"
  `);
});
