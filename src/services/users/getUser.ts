import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";

export const getUser = async (username: string): Promise<any> => {
  try {
    const user = await prisma.getUser(username);

    return user;
  } catch (error: unknown) {
    logError(error);
  }
};
