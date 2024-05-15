import { dynamodbClient } from "./dynamodbClient";
import { hashPassword } from "./hashPassword";

export const changePassword = async (username: string, newPassword: string) => {
  try {
    const hashedPassword = await hashPassword(newPassword);

    const res = await dynamodbClient.update({
      TableName: process.env.NEXT_PUBLIC_AUTH_DYNAMODB_TABLE_NAME,
      Key: {
        username,
      },
      UpdateExpression: "SET #passwordAttr = :newHashedPassword",
      ExpressionAttributeNames: {
        "#passwordAttr": "hashedPassword",
      },
      ExpressionAttributeValues: {
        ":newHashedPassword": hashedPassword,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
