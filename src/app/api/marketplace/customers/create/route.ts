import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

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

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Customer" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Customer" },
          { status: 403 },
        );
      }
    }

    const formData = await req.formData();

    const existingData = await prisma.customers.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Customer",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Customer",
          },
        });
      }
    }

    const customerData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      telephone: formData.get("telephone") as string,
      address: formData.get("address") as string,
      governorate: formData.get("governorate") as string,
      gender: formData.get("gender")
        ? (formData.get("gender") as string)
        : null,
      password: await hash(formData.get("password") as string, 10),
    };

    const existingCustomer = await prisma.customers.findFirst({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    const newCustomer = await prisma.customers.create({
      data: customerData,
    });

    return new NextResponse(JSON.stringify({ customer: newCustomer }), {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
