// Fichier : pages/api/products.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          sku: true,
          productName: true,
          productPrice: true,
          manufacturerId: true,
          warehouseIds: true,
        },
      });

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
