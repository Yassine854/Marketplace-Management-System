import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a reservation by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    // If user is KamiounAdminMaster, allow access
    if (userRole?.name === "KamiounAdminMaster") {
      const { id } = params;
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          customer: true,
          order: true,
          paymentMethod: true,
          reservationItems: {
            include: {
              product: true,
              partner: true,
              source: {
                include: {
                  partner: true,
                },
              },
            },
          },
        },
      });

      if (!reservation) {
        return NextResponse.json(
          { message: "Reservation not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { message: "Reservation retrieved successfully", reservation },
        { status: 200 },
      );
    }

    // For non-KamiounAdminMaster users, check permissions
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
        rp.permission?.resource === "Reservation" &&
        rp.actions.includes("read"),
    );

    if (!canRead) {
      return NextResponse.json(
        { message: "Forbidden: missing 'read' permission for Reservation" },
        { status: 403 },
      );
    }

    const { id } = params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: true,
        order: true,
        paymentMethod: true,
        reservationItems: {
          include: {
            product: true,
            partner: true,
            source: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Reservation retrieved successfully", reservation },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservation" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a reservation by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    // If user is not KamiounAdminMaster, check permissions
    if (userRole?.name !== "KamiounAdminMaster") {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canUpdate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Reservation" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Reservation" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();

    const { id: _id, ...updateData } = body;
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Reservation updated successfully",
        reservation: updatedReservation,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a reservation by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    // If user is not KamiounAdminMaster, check permissions
    if (userRole?.name !== "KamiounAdminMaster") {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Reservation" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Reservation" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    await prisma.reservationItem.deleteMany({
      where: { reservationId: id },
    });
    await prisma.reservation.delete({ where: { id } });

    return NextResponse.json(
      { message: "Reservation deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 },
    );
  }
}
