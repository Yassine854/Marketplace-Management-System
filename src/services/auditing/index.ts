import { PrismaClient } from "@prisma/client";
import { AuditLog } from "@/types/AuditLog";

const prisma = new PrismaClient();

export async function createAuditLog(auditObject: AuditLog) {
  const { username, userId, action, actionTime, orderId } = auditObject;
  //@ts-ignore
  await prisma.auditLog.create({
    data: {
      username,
      userId,
      action,
      actionTime: new Date(),
      orderId,
    },
  });
}
