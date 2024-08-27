import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";

export const getAllOrdersLogs = async (page: number) => {
  try {
    const take = 50;
    const { ordersLogs, count } = await prisma.getAllOrdersLogs(page, take);
    return { ordersLogs, count };
  } catch (error: any) {
    logError(error);
    throw new Error(
      error.message || "An error occurred while fetching order logs.",
    );
  }
};
