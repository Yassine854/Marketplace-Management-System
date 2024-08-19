import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";

export const getUser = async (username: string): Promise<any> => {
  try {
    const user = await prisma.getUser(username);
    console.log("🚀 ~ getUser ~ user:", user);

    return user;
  } catch (error: unknown) {
    logError(error);
  }
};
