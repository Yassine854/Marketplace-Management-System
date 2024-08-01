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
      throw new Error("User Not Found");
    }

    const isValid = await isPasswordValid(password, user?.password);

    if (!isValid) {
      throw new Error("Wrong Password");
    }
    return user;
  } catch (error) {
    logError(error);
    return null;
  }
};
