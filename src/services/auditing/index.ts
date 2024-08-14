import { PrismaClient } from "@prisma/client";
import { AuditLogRequestBody } from "@/types/AuditLogRequestBody";

const prisma = new PrismaClient();

export async function createAuditLog(auditObject: AuditLogRequestBody) {
  const { username, userid, action, actionTime, orderid } = auditObject;
  //@ts-ignore
  await prisma.auditLog.create({
    data: {
      username,
      userid,
      action,
      actionTime: new Date(),
      orderid,
    },
  });
}
