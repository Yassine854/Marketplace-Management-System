const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const getAllLogs = async () => {
  try {
    const logs = await prisma.log.findMany();
    console.log("Logs récupérés :", logs);
    return logs;
  } catch (error) {
    console.error("Erreur lors de la récupération des logs :", error);
  }
};

getAllLogs();
