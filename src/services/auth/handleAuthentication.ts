import { getPrismaUser } from "@/clients/prisma";
import { isPasswordValid } from "@/utils/password/isPasswordValid";
// // Method to set salt and hash the password for a user

export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    const user = await getPrismaUser(username);

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
    process.env.NODE_ENV === "development" &&
      console.error("Error authenticating user:", error);
    return null;
  }
};
