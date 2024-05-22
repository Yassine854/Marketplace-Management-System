import { compare } from "bcryptjs";
import { getUser } from "../bff/resolvers/queries/getUser";

export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    const { user } = await getUser(username);

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await compare(password, user.password);

    return isPasswordCorrect ? user : null;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
};
