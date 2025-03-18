import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a related product by ID
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
    const relatedProduct = await prisma.relatedProduct.findUnique({
      where: { id },
      include: {
        product: true,
        relatedProduct: true,
      },
    });

    if (!relatedProduct) {
      return NextResponse.json(
        { message: "Related product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Related product retrieved", relatedProduct },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching related product:", error);
    return NextResponse.json(
      { error: "Failed to retrieve related product" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a related product by ID
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

    const updatedRelatedProduct = await prisma.relatedProduct.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Related product updated",
        relatedProduct: updatedRelatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating related product:", error);
    return NextResponse.json(
      { error: "Failed to update related product" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a related product by ID
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

    await prisma.relatedProduct.delete({ where: { id } });

    return NextResponse.json(
      { message: "Related product deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting related product:", error);
    return NextResponse.json(
      { error: "Failed to delete related product" },
      { status: 500 },
    );
  }
}
