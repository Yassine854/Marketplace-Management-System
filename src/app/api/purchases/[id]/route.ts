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
      updateData.files = {
        upsert: body.files.map((file: any) => ({
          where: { id: file.id },
          create: {
            name: file.name,
            url: file.url,
            orderId: orderId,
          },
          update: {
            name: file.name,
            url: file.url,
          },
        })),
      };
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
      await Promise.all(
        body.products.map(async (product: any) => {
          await prisma.productOrdered.upsert({
            where: { id: product.id },
            create: {
              name: product.name,
              quantity: product.quantity,
              priceExclTax: product.priceExclTax,
              total: product.total,
              purchaseOrderId: orderId,
            },
            update: {
              quantity: product.quantity,
              priceExclTax: product.priceExclTax,
              total: product.total,
            },
          });
        }),
      );
    }

    if (body.paymentTypes) {
      await Promise.all(
        body.paymentTypes.map(async (payment: any) => {
          await prisma.payment.upsert({
            where: { id: payment.id },
            create: {
              paymentMethod: payment.type,
              percentage: payment.percentage,
              amount: payment.amount,
              manufacturerId: body.manufacturerId,
              purchaseOrderId: orderId,
            },
            update: {
              paymentMethod: payment.type,
              percentage: payment.percentage,
              amount: payment.amount,
              manufacturerId: body.manufacturerId,
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
