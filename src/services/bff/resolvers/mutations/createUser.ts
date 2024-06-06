import { User } from "@/types/user";
import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/libs/prisma/prismaClient";

export const createUser = async (
  newUser: any,
): Promise<{ data: User | undefined; message: string; success: boolean }> => {
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
        status: "pending",
      },
    });

    if (!user) {
      throw new Error("Unable To Create User");
    }
    return {
      //@ts-ignore
      data: user,
      success: true,
      message: "User Created Successfully !",
    };
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return { data: undefined, message: err as string, success: false };
  }
};
