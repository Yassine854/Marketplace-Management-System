import { compare, hash } from "bcryptjs";

import { dynamodbClient } from "./dynamodbClient";

const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 8);
  return hashedPassword;
};

const createUser = async (username: string, password: string, role: string) => {
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

const changePassword = async (username: string, newPassword: string) => {
  try {
    const hashedPassword = await hashPassword(newPassword);

    const res = await dynamodbClient.update({
      TableName: process.env.AUTH_DYNAMODB_TABLE_NAME,
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

// const resUser = await createUser(username, password, "ADMIN");
export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    const res = await dynamodbClient.get({
      TableName: process.env.AUTH_DYNAMODB_TABLE_NAME,
      Key: {
        username: username,
      },
    });

    const user = {
      username: res?.Item?.username,
      hashedPassword: res?.Item?.hashedPassword,
      role: res?.Item?.role,
    };

    if (!user?.username || !user?.hashedPassword || !user?.role) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await compare(password, user?.hashedPassword);

    return isPasswordCorrect ? user : null;
  } catch (error) {
    console.error(error);
  }
};
