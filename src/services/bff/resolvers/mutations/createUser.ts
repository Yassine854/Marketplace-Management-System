import { User } from "@/types/user";
import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/libs/prisma/prismaClient";
import { withErrorHandling } from "@/utils/withErrorHandling";

export const createUser = async (
  newUser: any,
): Promise<{ data: User; message: string }> => {
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
  return { data: user, message: "User Created Successfully !" };
};
