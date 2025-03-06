import { prisma } from "@/clients/prisma";
import { Log } from "@/types/log"; // Adjust the import path as necessary

export const getAllLogs = async (): Promise<Log[]> => {
  try {
    const logs = await prisma.getAllLogs();

    return logs;
  } catch (error: any) {
    throw new Error(error);
  }
};
