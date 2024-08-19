import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";

export const getAllOrdersLogs = async () => {
  try {
    const ordersLogs = await prisma.getAllOrdersLogs();

    return ordersLogs;
  } catch (error: any) {
    logError(error);

    throw new Error(error);
  }
};
