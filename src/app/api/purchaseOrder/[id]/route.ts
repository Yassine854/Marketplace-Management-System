import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: {
        manufacturer: { select: { companyName: true } },
        warehouse: { select: { name: true } },
        payments: true,
        products: true,
        comments: { select: { content: true } },
        files: { select: { name: true, url: true } },
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: "Purchase order not found" },
        { status: 404 },
      );
    }

    const mappedData = {
      ...purchaseOrder,
      supplier: purchaseOrder.manufacturer,
      comment: purchaseOrder.comments
        .map((comment) => comment.content)
        .join(", "),
      files: purchaseOrder.files,
      paymentTypes: purchaseOrder.payments.map((payment) => ({
        type: payment.paymentMethod,
        percentage: payment.percentage,
        amount: payment.amount,
      })),
    };

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch purchase order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
