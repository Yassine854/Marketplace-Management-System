import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  console.log("[API] Requête pour le fournisseur ID:", supplierId);

  if (!supplierId) {
    return NextResponse.json(
      { error: "Paramètre supplierId manquant" },
      { status: 400 },
    );
  }

  try {
    // Conversion explicite en string
    const supplierIdString = supplierId.toString();

    const products = await prisma.products.findMany({
      where: {
        manufacturer: supplierIdString,
      },
      include: {
        stock_item: true,
      },
    });

    console.log("[API] Produits trouvés:", products);
    return NextResponse.json(products);
  } catch (error) {
    console.error("[API] Erreur:", error);
    return NextResponse.json(
      { error: "Échec de la récupération", details: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
