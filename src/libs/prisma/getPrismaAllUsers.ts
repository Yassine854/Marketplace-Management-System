import { prismaClient } from "./prismaClient";

export const getPrismaAllUsers = async () => {
  try {
    const users = await prismaClient.user.findMany();

    return users;
  } catch (err) {
    console.error("Get Prisma All Users Error ", err);
  }
};
