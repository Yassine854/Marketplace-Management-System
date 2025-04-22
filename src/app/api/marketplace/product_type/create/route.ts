// app/api/productTypes/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new ProductType
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: user.mRoleId,
      },
      include: {
        permission: true,
      },
    });

    // console.log("Fetched rolePermissions:", rolePermissions);

    const canCreate = rolePermissions.some(
      (rp) =>
        rp.permission?.resource === "Product Type" &&
        rp.actions.includes("create"),
    );

    if (!canCreate) {
      return NextResponse.json(
        { message: "Forbidden: missing 'create' permission for Product Type" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // Create the ProductType in the database
    const newProductType = await prisma.productType.create({
      data: {
        type: body.type,
      },
    });

    return NextResponse.json(
      {
        message: "ProductType created successfully",
        productType: newProductType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ProductType:", error);
    return NextResponse.json(
      { error: "Failed to create ProductType" },
      { status: 500 },
    );
  }
}
