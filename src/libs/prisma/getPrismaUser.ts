import { prismaClient } from "./prismaClient";

export const getPrismaUser = async (username: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  return user;
};
