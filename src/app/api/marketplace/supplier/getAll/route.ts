import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Check if user is KamiounAdminMaster or has required permission
    if (userRole?.name !== "KamiounAdminMaster") {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Supplier" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Supplier" },
          { status: 403 },
        );
      }
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const search = url.searchParams.get("search") || "";

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const manufacturers = await prisma.manufacturer.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { code: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
          { contactName: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } },
          { postalCode: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { country: { contains: search, mode: "insensitive" } },
          { capital: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        supplierCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    const totalManufacturers = await prisma.manufacturer.count({
      where: {
        OR: [
          { code: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
          { contactName: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } },
          { postalCode: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { country: { contains: search, mode: "insensitive" } },
          { capital: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    if (manufacturers.length === 0) {
      return NextResponse.json(
        {
          message: "No manufacturers found",
          manufacturers: [],
          total: totalManufacturers,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Manufacturers retrieved successfully",
        manufacturers: manufacturers.map((manufacturer) => ({
          ...manufacturer,
          supplierCategories: manufacturer.supplierCategories.map(
            (supplierCategory) => ({
              ...supplierCategory,
              categoryName: supplierCategory.category.nameCategory,
            }),
          ),
        })),
        totalManufacturers,
        currentPage: page,
        totalPages: Math.ceil(totalManufacturers / limit),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve manufacturers" },
      { status: 500 },
    );
  }
}
