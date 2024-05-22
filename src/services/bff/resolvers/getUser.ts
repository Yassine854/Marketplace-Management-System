import { User } from "@/types/user";
import { prismaClient } from "@/libs/prismaClient";

export const getUser = async (username: string): Promise<User | undefined> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    return user ?? undefined;
  } catch (error) {
    console.error(error);
  }
};
