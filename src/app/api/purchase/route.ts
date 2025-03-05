import { OrderState, PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      manufacturerId,
      warehouseId,
      deliveryDate,
      totalAmount,
      status,
      comments,
      payments,
      files,
      products,
    } = await req.json();

    if (!manufacturerId || !warehouseId) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 },
      );
    }

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: `PO-${Date.now()}`,
        manufacturer: { connect: { manufacturerId: parseInt(manufacturerId) } },
        warehouse: { connect: { warehouseId: parseInt(warehouseId) } },
        deliveryDate: new Date(deliveryDate),
        totalAmount: parseFloat(totalAmount),
        status: status as OrderState,

        comments:
          comments?.length > 0
            ? {
                create: comments.map((comment: { content: string }) => ({
                  content: comment.content,
                })),
              }
            : undefined,

        payments:
          payments?.length > 0
            ? {
                create: payments
                  .filter((payment: any) => {
                    const amount = parseFloat(payment.amount);
                    const percentage = parseFloat(payment.percentage);
                    const validMethods = Object.values(PaymentMethod);
                    return (
                      !isNaN(amount) &&
                      amount > 0 &&
                      validMethods.includes(
                        payment.paymentMethod.toUpperCase(),
                      ) &&
                      !isNaN(percentage) &&
                      percentage >= 0 &&
                      percentage <= 100
                    );
                  })
                  .map((payment: any) => ({
                    amount: parseFloat(payment.amount),
                    paymentMethod: payment.paymentMethod.toUpperCase(),
                    percentage: parseFloat(payment.percentage) || 0,
                    manufacturerId: Number(manufacturerId) || 0,
                    paymentDate: new Date(payment.date),
                  })),
              }
            : undefined,

        files: {
          connect: (Array.isArray(files) ? files : []).map(
            (file: { id: string }) => ({ id: file.id }),
          ),
        },

        products: {
          create: (Array.isArray(products) ? products : []).map(
            (product: any) => ({
              name: product.name,
              quantity: product.quantity,
              priceExclTax: product.priceExclTax,
              total: product.total,
            }),
          ),
        },
      },
      include: {
        comments: true,
        payments: true,
        files: true,
        products: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Erreur création commande:", error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement" },
      { status: 500 },
    );
  }
}
