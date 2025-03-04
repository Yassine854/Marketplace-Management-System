// pages/api/logs.ts
import { prismaClient } from "../../../clients/prisma/prismaClient"; // Assuming prisma is set up in lib/prisma.ts

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const logs = await prismaClient.log.findMany();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching logs" });
  }
}
