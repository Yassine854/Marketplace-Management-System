import { prismaClient } from "./prismaClient";

export const getPrismaUser = async (username: string) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  } catch (err) {
    console.error("Get Primsa User Error ", err);
  }
};
