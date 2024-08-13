import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { AuditLogRequestBody } from "@/types/AuditLogRequestBody";

const prisma = new PrismaClient();

async function createAuditLog(auditObject: AuditLogRequestBody) {
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

export default createAuditLog;
