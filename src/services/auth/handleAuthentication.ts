import { getPrismaUser } from "@/libs/prisma";
import { isPasswordValid } from "@/utils/isPasswordValid";
// // Method to set salt and hash the password for a user

export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    const user = await getPrismaUser(username);

    if (!user) {
      console.error("User Not Found");
      return null;
    }

    const storedPassword = JSON.parse(user?.password);

    if (isPasswordValid(password, storedPassword.hash, storedPassword.salt)) {
      return user;
    }
    console.error("Wrong Password");
    return null;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
};
