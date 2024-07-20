import { prisma } from "@/clients/prisma";
import { isPasswordValid } from "@/utils/password/isPasswordValid";
import { logError } from "@/utils/logError";

export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    const user = await prisma.getUser(username);

    if (!user) {
      process.env.NODE_ENV === "development" && console.error("User Not Found");
      return null;
    }

    const isValid = await isPasswordValid(password, user?.password);

    if (isValid) {
      return user;
    }
    process.env.NODE_ENV === "development" && console.error("Wrong Password");
    return null;
  } catch (error) {
    logError(error);
    return null;
  }
};
