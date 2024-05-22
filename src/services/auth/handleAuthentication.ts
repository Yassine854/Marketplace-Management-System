import { compare } from "bcryptjs";
import { getUser } from "../bff/resolvers/queries/getUser";
export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    const res = await getUser(username);
    console.log("🚀 ~ user:", res);
    // const res = await dynamodbClient.get({
    //   TableName: process.env.NEXT_PUBLIC_AUTH_DYNAMODB_TABLE_NAME,
    //   Key: {
    //     username: username,
    //   },
    // });

    // const user = {
    //   username: res?.Item?.username,
    //   hashedPassword: res?.Item?.hashedPassword,

    //   role: res?.Item?.role,
    // };

    // if (!user?.username || !user?.hashedPassword || !user?.role) {
    //   throw new Error("Invalid credentials");
    // }

    // const isPasswordCorrect = await compare(password, user?.hashedPassword);
    //return isPasswordCorrect ? user : null;

    return {
      username: "test123",
      hashedPassword: "234324",
      role: "ADMIN",
    };
  } catch (error) {
    console.error(error);
  }
};
