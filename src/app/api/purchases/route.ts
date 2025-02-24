import { NextResponse } from "next/server";
import { OrderState, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const searchTerm = (searchParams.get("search") || "").toLowerCase();
    const status = (searchParams.get("status") as OrderState) || undefined;

    const where: any = {
      OR: [
        {
          orderNumber: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            companyName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          warehouse: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    };

    if (status) where.status = status;
    if (searchParams.get("paymentMethod")) {
      where.payments = {
        some: { paymentMethod: searchParams.get("paymentMethod") },
      };
    }
    if (searchParams.get("deliveryDateStart")) {
      where.deliveryDate = {
        gte: new Date(searchParams.get("deliveryDateStart")!),
      };
    }
    if (searchParams.get("deliveryDateEnd")) {
      where.deliveryDate.lte = new Date(searchParams.get("deliveryDateEnd")!);
    }

    const [data, total] = await prisma.$transaction([
      prisma.purchaseOrder.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          manufacturer: { select: { companyName: true } },
          warehouse: { select: { name: true } },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch purchases",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
