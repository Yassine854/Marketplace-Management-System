import { getPrismaUser } from "@/libs/prisma";
import { isPasswordValid } from "@/utils/isPasswordValid";
// // Method to set salt and hash the password for a user

export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    //const user = await getPrismaUser(username);
    const user = {
      id: "6653642aa14959b57cba5694",
      username: "123456",
      email: null,
      password: "123456",
      role: "agent",
      status: "pending",
      warehouses: [],
      roleId: null,
    };

    if (!user) {
      console.error("User Not Found");
      return null;
    }

    if (isPasswordValid(password, user?.password)) {
      return user;
    }
    console.error("Wrong Password");
    return null;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
};
