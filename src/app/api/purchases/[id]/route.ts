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

    const updateData: any = {
      deliveryDate: body.deliveryDate,
      totalAmount: body.totalAmount,
      status: body.status,
      comments: body.comment
        ? {
            deleteMany: {},

            create: { content: body.comment },
          }
        : undefined,
    };

    if (body.warehouseId) {
      updateData.warehouse = { connect: { warehouseId: body.warehouseId } };
    }

    if (body.supplierId) {
      const manufacturerId = body.supplierId;

      updateData.manufacturer = {
        connect: { manufacturerId: manufacturerId },
      };
    }

    if (body.files) {
      await prisma.file.deleteMany({
        where: { orderId: orderId },
      });

      await prisma.file.createMany({
        data: body.files.map((file: any) => ({
          name: file.name,

          url: file.url,

          orderId: orderId,
        })),
      });
    }

    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: updateData,
      include: {
        manufacturer: true,
        warehouse: true,
        payments: true,
        comments: true,
        files: true,
      },
    });

    if (body.products) {
      await prisma.productOrdered.deleteMany({
        where: { purchaseOrderId: orderId },
      });

      await prisma.productOrdered.createMany({
        data: body.products.map((product: any) => ({
          name: product.name,

          quantity: product.quantity,

          priceExclTax: product.priceExclTax,

          total: product.total,

          purchaseOrderId: orderId,

          sku: product.sku,
        })),
      });
    }

    if (body.paymentTypes) {
      await prisma.payment.deleteMany({
        where: { purchaseOrderId: orderId },
      });

      await prisma.payment.createMany({
        data: body.paymentTypes.map((payment: any) => ({
          paymentMethod: payment.type,

          percentage: payment.percentage,

          amount: payment.amount,
          paymentDate: new Date(payment.paymentDate),

          purchaseOrderId: orderId,

          manufacturerId: body.supplierId,
        })),
      });
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
