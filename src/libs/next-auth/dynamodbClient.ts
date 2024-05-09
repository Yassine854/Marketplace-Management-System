import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AUTH_DYNAMODB_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AUTH_DYNAMODB_SECRET as string,
  },
  region: process.env.NEXT_PUBLIC_AUTH_DYNAMODB_REGION,
};

export const dynamodbClient = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});
