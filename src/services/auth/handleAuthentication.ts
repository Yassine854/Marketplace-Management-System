import { compare } from "bcryptjs";
import { getPrismaUser } from "@/libs/prisma";

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

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      console.error("Wrong Password");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
};
