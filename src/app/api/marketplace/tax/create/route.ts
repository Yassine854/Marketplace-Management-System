// app/api/taxes/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new tax
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newTax = await prisma.tax.create({
      data: {
        value: body.value,
      },
    });

    return NextResponse.json(
      { message: "Tax created successfully", tax: newTax },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating tax:", error);
    return NextResponse.json(
      { error: "Failed to create tax" },
      { status: 500 },
    );
  }
}
