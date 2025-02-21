import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    console.log(products);
    return NextResponse.json(
      products.map(
        (p: {
          id: string;
          product_id: number;
          sku: string;
          name: string;
          price: number;
          special_price: number | null;
          cost: number | null;
          manufacturer: string | null;
          category_ids: number[];
          website_ids: number[];
          image: string | null;
          url_key: string | null;
          created_at: Date;
          updated_at: Date;
        }) => ({
          id: p.id,
          product_id: p.product_id,
          sku: p.sku,
          name: p.name,
          price: p.price,
          special_price: p.special_price || null,
          cost: p.cost || null,
          manufacturer: p.manufacturer || null,
          category_ids: p.category_ids,
          website_ids: p.website_ids,
          image: p.image || null,
          url_key: p.url_key || null,
          created_at: p.created_at.toISOString(),
          updated_at: p.updated_at.toISOString(),
        }),
      ),
    );
  } catch (error) {
    console.error("Erreur API products:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des produits" },
      { status: 500 },
    );
  }
}
