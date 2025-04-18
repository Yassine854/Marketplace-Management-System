// app/api/skupartner/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const skuPartner = await prisma.skuPartner.findUnique({
      where: { id },
      include: {
        product: true,
        partner: true,
      },
    });

    if (!skuPartner) {
      return NextResponse.json(
        { message: "SkuPartner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SkuPartner retrieved successfully", skuPartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching SkuPartner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve SkuPartner" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedSkuPartner = await prisma.skuPartner.update({
      where: { id },
      data: {
        productId: body.productId,
        partnerId: body.partnerId,
        skuPartner: body.skuPartner,
        skuProduct: body.skuProduct,
      },
    });

    return NextResponse.json(
      {
        message: "SkuPartner updated successfully",
        skuPartner: updatedSkuPartner,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating SkuPartner:", error);
    return NextResponse.json(
      { error: "Failed to update SkuPartner" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.skuPartner.delete({ where: { id } });

    return NextResponse.json(
      { message: "SkuPartner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting SkuPartner:", error);
    return NextResponse.json(
      { error: "Failed to delete SkuPartner" },
      { status: 500 },
    );
  }
}
