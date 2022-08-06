import velocityUtil from "amplify-appsync-simulator/lib/velocity/util";
import velocityTemplate from "amplify-velocity-template";
import velocityMapper from "amplify-appsync-simulator/lib/velocity/value-mapper/mapper";

test("template test", async () => {
  const template = `{
    "version": "2018-05-29",
    "operation": "GetItem",
    "key": {
        "id": $util.dynamodb.toDynamoDBJson($context.arguments.id),
    }
}`;

  const errors: any[] = [];
  const now = new Date();
  const graphQLResolveInfo = {} as any;
  const appSyncGraphQLExecutionContext = {} as any;

  const vtlUtil = velocityUtil.create(
    errors,
    now,
    graphQLResolveInfo,
    appSyncGraphQLExecutionContext
  );

  const vtlAST = velocityTemplate.parse(template);
  const vtlCompiler = new velocityTemplate.Compile(vtlAST, {
    valueMapper: velocityMapper.map,
    escape: false
  });

  const context = {
    arguments: { id: "USER_ID" },
    args: { id: "USER_ID" }
  };

  const renderedTemplate = vtlCompiler.render({
    util: vtlUtil,
    utils: vtlUtil,
    ctx: context,
    context
  });

  expect(renderedTemplate).toMatchInlineSnapshot(`
    "{
        \\"version\\": \\"2018-05-29\\",
        \\"operation\\": \\"GetItem\\",
        \\"key\\": {
            \\"id\\": {\\"S\\":\\"USER_ID\\"},
        }
    }"
  `);
});
