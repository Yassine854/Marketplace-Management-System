// app/api/subCategories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all subcategories
export async function GET() {
  try {
    const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: true, // Include related category details
      },
    });

    return NextResponse.json(
      { message: "SubCategories retrieved successfully", subCategories },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching subCategories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subCategories" },
      { status: 500 },
    );
  }
}
