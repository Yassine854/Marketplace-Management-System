import { prismaClient } from "./prismaClient";

export const getAllOrdersLogs = async () => {
  try {
    const ordersLogs = await prismaClient.ordersAuditTrail.findMany();
    if (!ordersLogs) {
      throw new Error();
    }
    return ordersLogs;
  } catch (err) {
    console.error("Get Prisma All Users Error ", err);
  }
};
