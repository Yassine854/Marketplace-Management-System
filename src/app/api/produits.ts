import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        warehouses: true,
      },
    });

    return NextResponse.json(
      products.map(
        (p: {
          id: any;
          productName: any;
          productPrice: any;
          sku: any;
          manufacturerId: any;
          warehouseIds: any;
        }) => ({
          id: p.id,

          productName: p.productName,

          productPrice: p.productPrice,

          sku: p.sku,

          manufacturerId: parseInt(p.manufacturerId || "0"), // ✅ Conversion en number

          warehouseIds: p.warehouseIds,
        }),
      ),
    );
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
