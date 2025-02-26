import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const orderId = params.id;
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Données de mise à jour manquantes" },
        { status: 400 },
      );
    }

    // Prepare the update data for the purchase order
    const updateData: any = {
      deliveryDate: body.deliveryDate,
      totalAmount: body.totalAmount,
      status: body.status,
    };

    // Connect warehouse if provided
    if (body.warehouseId) {
      updateData.warehouse = { connect: { warehouseId: body.warehouseId } };
    }

    // Connect manufacturer if provided
    if (body.manufacturerId) {
      updateData.manufacturer = {
        connect: { manufacturerId: body.manufacturerId },
      };
    }

    // Update the purchase order
    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: updateData,
      include: {
        manufacturer: true,
        warehouse: true,
        payments: true,
      },
    });

    // Update products if provided
    if (body.products) {
      await Promise.all(
        body.products.map(async (product: any) => {
          await prisma.productOrdered.upsert({
            where: { id: product.id }, // Assuming each product has a unique ID
            create: {
              name: product.name,
              quantity: product.quantity,
              priceExclTax: product.priceExclTax,
              total: product.total, // Ensure total is included if needed
              purchaseOrderId: orderId, // Link to the purchase order
            },
            update: {
              quantity: product.quantity,
              priceExclTax: product.priceExclTax,
              total: product.total, // Update total if needed
            },
          });
        }),
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return NextResponse.json(
      { error: "Échec de la mise à jour de la commande" },
      { status: 500 },
    );
  }
}
