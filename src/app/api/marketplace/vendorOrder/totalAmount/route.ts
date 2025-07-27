import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/services/auth";

const prisma = new PrismaClient();

// GET: Get sum of total amounts for vendor orders where status is not canceled
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string };

    // Get sum of totals from vendor orders where partnerId matches user.id and status name is not "canceled"
    const result = await prisma.vendorOrder.aggregate({
      where: {
        partnerId: user.id,
        status: {
          name: {
            not: "canceled",
          },
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalAmount = result._sum.total || 0;

    return NextResponse.json(
      {
        message: "Total amount retrieved successfully",
        totalAmount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching total amount:", error);
    return NextResponse.json(
      { error: "Failed to retrieve total amount" },
      { status: 500 },
    );
  }
}
