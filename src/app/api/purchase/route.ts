import { NextApiRequest, NextApiResponse } from "next/types";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const order = await prisma.purchaseOrder.create({
        data: {
          ...req.body,
          files: {
            connect: req.body.filesIds?.map((id: string) => ({ id })),
          },
        },
        include: {
          files: true,
        },
      });
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  }
}
