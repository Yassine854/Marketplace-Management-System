import { User } from "@/types/user";
import { prismaClient } from "@/libs/prismaClient";

export const getUsers = async (): Promise<User[] | undefined> => {
  try {
    const users = await prismaClient.user.findMany();
    return users ?? undefined;
  } catch (error) {
    console.error(error);
  }
};
