import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all customers with their related favorite products, favorite partners, and orders
export async function GET(req: Request) {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const customers = await prisma.customers.findMany({
      include: {
        favoriteProducts: true,
        favoritePartners: true,
        orders: true,
        reservations: true,
        notifications: true,
      },
    });

    if (customers.length === 0) {
      return NextResponse.json(
        { message: "No customers found", customers: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Customers retrieved successfully", customers },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customers" },
      { status: 500 },
    );
  }
}
