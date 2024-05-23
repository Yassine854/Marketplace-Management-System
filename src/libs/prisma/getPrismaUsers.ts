import { prismaClient } from "./prismaClient";

export const getPrismaUsers = async () => {
  const users = await prismaClient.user.findMany();

  return users;
};
