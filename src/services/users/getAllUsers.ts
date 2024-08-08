import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";

export const getAllUsers = async () => {
  try {
    const users = await prisma.getAllUsers();
    console.log("🚀 ~ getAllUsers ~ users:", users);

    return users;
  } catch (error: any) {
    logError(error);

    throw new Error(error);
  }
};
