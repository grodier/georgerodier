import { DynamoDB, config } from "aws-sdk";

config.update({
  region: process.env.AWS_PORTFOLIO_REGION,
  signatureVersion: "v4",
  credentials: {
    accessKeyId: process.env.AWS_PORTFOLIO_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_PORTFOLIO_SECRET_ACCESS_KEY || "",
  },
});

const client = new DynamoDB.DocumentClient();

const db = {
  get: (params: any) => client.get(params).promise(),
  put: (params: any) => client.put(params).promise(),
  query: (params: any) => client.query(params).promise(),
  update: (params: any) => client.update(params).promise(),
  delete: (params: any) => client.delete(params).promise(),
};

const TABLE_NAME = "octocache";

export async function addToCache(path: string, item: any) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      pk: `PATH#${path.replace(/\//g, "_")}`,
      item: JSON.stringify(item),
    },
  };

  return await db.put(params);
}

export async function readFromCache(path: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      pk: `PATH#${path.replace(/\//g, "_")}`,
    },
  };

  const result = await db.get(params);
  return JSON.parse(result.Item?.item || "");
}
