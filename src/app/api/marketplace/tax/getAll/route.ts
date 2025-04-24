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
          rp.permission?.resource === "Tax" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Tax" },
          { status: 403 },
        );
      }
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const searchTerm = url.searchParams.get("search") || "";

    const filterConditions: any = {};

    if (searchTerm) {
      const parsedSearchTerm = parseFloat(searchTerm);
      if (!isNaN(parsedSearchTerm)) {
        filterConditions.value = parsedSearchTerm;
      } else {
        filterConditions.name = {
          contains: searchTerm,
          mode: "insensitive",
        };
      }
    }

    const skip = (page - 1) * limit;

    const taxes = await prisma.tax.findMany({
      where: filterConditions,
      skip,
      take: limit,
    });

    const totalTaxes = await prisma.tax.count({
      where: filterConditions,
    });

    if (taxes.length === 0) {
      return NextResponse.json(
        { message: "No taxes found", taxes: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Taxes retrieved successfully",
        taxes,
        totalTaxes,
        currentPage: page,
        totalPages: Math.ceil(totalTaxes / limit),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve taxes" },
      { status: 500 },
    );
  }
}
