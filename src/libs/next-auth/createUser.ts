import { dynamodbClient } from "./dynamodbClient";
import { hashPassword } from "./hashPassword";

export const createUser = async (
  username: string,
  password: string,
  role: string,
) => {
  try {
    const hashedPassword = await hashPassword(password);
    const res = await dynamodbClient.put({
      TableName: process.env.AUTH_DYNAMODB_TABLE_NAME,
      Item: {
        username,
        role,
        hashedPassword,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
