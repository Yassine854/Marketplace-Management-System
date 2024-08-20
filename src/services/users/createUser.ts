import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/clients/prisma/prismaClient";
import { logError } from "@/utils/logError";

export const createUser = async (newUser: any): Promise<any> => {
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { username: newUser.username },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(newUser.password);

    const user = await prismaClient.user.create({
      data: {
        ...newUser,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new Error("Unable To Create User");
    }
    return user;
  } catch (err) {
    logError(err);
  }
};
