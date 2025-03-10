import { prismaClient } from "./prismaClient";

export const getAllLogs = async () => {
  try {
    console.log("fetching logs from the database");
    const logs = await prismaClient.log.findMany();
    console.log("logs fetched", logs);

    if (!logs || logs.length === 0) {
      throw new Error("No logs found");
    }

    return logs;
  } catch (err) {
    console.error("Get Prisma All Logs Error: ", err);
    return [];
  }
};
