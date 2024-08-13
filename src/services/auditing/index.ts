import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { AuditLogRequestBody } from "@/types/AuditLogRequestBody";

const prisma = new PrismaClient();

async function createAuditLog(req: NextApiRequest, res: NextApiResponse) {
  const {
    id,
    username,
    userid,
    action,
    actionTime,
    orderid,
  }: AuditLogRequestBody = req.body;
  //@ts-ignore
  await prisma.auditLog.create({
    data: {
      id,
      username,
      userid,
      action,
      actionTime: new Date(),
      orderid,
    },
  });
}

export default createAuditLog;
