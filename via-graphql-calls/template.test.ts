import fs from "fs";
import path from "path";
import { gql, request } from "graphql-request";

const outputsFilePath = path.join(__dirname, "./outputs.json");
const outputsFileContents = JSON.parse(
  fs.readFileSync(outputsFilePath, "utf8")
) as {
  [key: string]: {
    endpointUrl: string;
    tableName: string;
    endpointAPIkey: string;
  };
};

const { endpointUrl, endpointAPIkey } = Object.entries(
  outputsFileContents
)[0]?.[1] as {
  endpointUrl: string;
  tableName: string;
  endpointAPIkey: string;
};

test("template test", async () => {
  const query = gql`
    query {
      getUser(id: "USER_ID") {
        id
        name
      }
    }
  `;
  const response = await request(
    endpointUrl,
    query,
    {},
    {
      "x-api-key": endpointAPIkey
    }
  );
  expect(response).toMatchInlineSnapshot(`
    {
      "getUser": {
        "id": "USER_ID",
        "name": "CREATED_AT_INFRASTRUCTURE_DEPLOY_TIME",
      },
    }
  `);
});
