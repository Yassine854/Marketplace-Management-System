import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../../services/auth";

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
      userType?: string;
    };

    // Get user's role to check if they're KamiounAdminMaster
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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Order" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Order" },
          { status: 403 },
        );
      }
    }

    let whereClause: any = {};

    // If the user is a partner, force the partnerId to be the logged-in user's id
    if (user.userType === "partner") {
      whereClause.orderItems = {
        some: {
          source: {
            partnerId: user.id,
          },
        },
      };
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const offset = (page - 1) * limit;
    const searchById = url.searchParams.get("searchById");
    const statusId = url.searchParams.get("statusId");
    const stateId = url.searchParams.get("stateId");
    const customerId = url.searchParams.get("customerId");
    const agentId = url.searchParams.get("agentId");
    const partnerId = url.searchParams.get("partnerId");
    const paymentMethodId = url.searchParams.get("paymentMethodId");
    const fromMobile = url.searchParams.get("fromMobile");
    const isActive = url.searchParams.get("isActive");
    const minAmountExclTax = url.searchParams.get("minAmountExclTax");
    const maxAmountExclTax = url.searchParams.get("maxAmountExclTax");
    const minAmountTTC = url.searchParams.get("minAmountTTC");
    const maxAmountTTC = url.searchParams.get("maxAmountTTC");
    const minAmountBeforePromo = url.searchParams.get("minAmountBeforePromo");
    const maxAmountBeforePromo = url.searchParams.get("maxAmountBeforePromo");
    const minAmountAfterPromo = url.searchParams.get("minAmountAfterPromo");
    const maxAmountAfterPromo = url.searchParams.get("maxAmountAfterPromo");
    const minAmountRefunded = url.searchParams.get("minAmountRefunded");
    const maxAmountRefunded = url.searchParams.get("maxAmountRefunded");
    const minAmountCanceled = url.searchParams.get("minAmountCanceled");
    const maxAmountCanceled = url.searchParams.get("maxAmountCanceled");
    const minAmountOrdered = url.searchParams.get("minAmountOrdered");
    const maxAmountOrdered = url.searchParams.get("maxAmountOrdered");
    const minAmountShipped = url.searchParams.get("minAmountShipped");
    const maxAmountShipped = url.searchParams.get("maxAmountShipped");
    const minLoyaltyPtsValue = url.searchParams.get("minLoyaltyPtsValue");
    const maxLoyaltyPtsValue = url.searchParams.get("maxLoyaltyPtsValue");
    const minWeight = url.searchParams.get("minWeight");
    const maxWeight = url.searchParams.get("maxWeight");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const shippingMethod = url.searchParams.get("shippingMethod");

    if (searchById && !/^[0-9a-fA-F]{24}$/.test(searchById)) {
      return NextResponse.json(
        { message: "Invalid order ID format." },
        { status: 400 },
      );
    }

    if (searchById) whereClause.id = searchById;
    if (statusId) whereClause.statusId = statusId;
    if (stateId) whereClause.stateId = stateId;
    if (customerId) whereClause.customerId = customerId;
    if (agentId) whereClause.agentId = agentId === "none" ? null : agentId;
    if (partnerId) whereClause.partnerId = partnerId;
    if (paymentMethodId) whereClause.paymentMethodId = paymentMethodId;
    if (fromMobile) whereClause.fromMobile = fromMobile === "true";
    if (isActive) whereClause.isActive = isActive === "true";
    if (minAmountExclTax) {
      whereClause.amountExclTaxe = { gte: parseFloat(minAmountExclTax) };
    }
    if (maxAmountExclTax) {
      whereClause.amountExclTaxe = {
        ...(whereClause.amountExclTaxe || {}),
        lte: parseFloat(maxAmountExclTax),
      };
    }
    if (minAmountTTC) {
      whereClause.amountTTC = { gte: parseFloat(minAmountTTC) };
    }
    if (maxAmountTTC) {
      whereClause.amountTTC = {
        ...(whereClause.amountTTC || {}),
        lte: parseFloat(maxAmountTTC),
      };
    }
    if (minAmountBeforePromo) {
      whereClause.amountBeforePromo = { gte: parseFloat(minAmountBeforePromo) };
    }
    if (maxAmountBeforePromo) {
      whereClause.amountBeforePromo = {
        ...(whereClause.amountBeforePromo || {}),
        lte: parseFloat(maxAmountBeforePromo),
      };
    }
    if (minAmountAfterPromo) {
      whereClause.amountAfterPromo = { gte: parseFloat(minAmountAfterPromo) };
    }
    if (maxAmountAfterPromo) {
      whereClause.amountAfterPromo = {
        ...(whereClause.amountAfterPromo || {}),
        lte: parseFloat(maxAmountAfterPromo),
      };
    }
    if (minAmountRefunded) {
      whereClause.amountRefunded = { gte: parseFloat(minAmountRefunded) };
    }
    if (maxAmountRefunded) {
      whereClause.amountRefunded = {
        ...(whereClause.amountRefunded || {}),
        lte: parseFloat(maxAmountRefunded),
      };
    }
    if (minAmountCanceled) {
      whereClause.amountCanceled = { gte: parseFloat(minAmountCanceled) };
    }
    if (maxAmountCanceled) {
      whereClause.amountCanceled = {
        ...(whereClause.amountCanceled || {}),
        lte: parseFloat(maxAmountCanceled),
      };
    }
    if (minAmountOrdered) {
      whereClause.amountOrdered = { gte: parseFloat(minAmountOrdered) };
    }
    if (maxAmountOrdered) {
      whereClause.amountOrdered = {
        ...(whereClause.amountOrdered || {}),
        lte: parseFloat(maxAmountOrdered),
      };
    }
    if (minAmountShipped) {
      whereClause.amountShipped = { gte: parseFloat(minAmountShipped) };
    }
    if (maxAmountShipped) {
      whereClause.amountShipped = {
        ...(whereClause.amountShipped || {}),
        lte: parseFloat(maxAmountShipped),
      };
    }
    if (minLoyaltyPtsValue) {
      whereClause.loyaltyPtsValue = { gte: parseInt(minLoyaltyPtsValue) };
    }
    if (maxLoyaltyPtsValue) {
      whereClause.loyaltyPtsValue = {
        ...(whereClause.loyaltyPtsValue || {}),
        lte: parseInt(maxLoyaltyPtsValue),
      };
    }
    if (minWeight) {
      whereClause.weight = { gte: parseFloat(minWeight) };
    }
    if (maxWeight) {
      whereClause.weight = {
        ...(whereClause.weight || {}),
        lte: parseFloat(maxWeight),
      };
    }
    if (dateFrom) {
      whereClause.createdAt = { gte: new Date(dateFrom) };
    }
    if (dateTo) {
      whereClause.createdAt = {
        ...(whereClause.createdAt || {}),
        lte: new Date(dateTo),
      };
    }
    if (shippingMethod) {
      whereClause.shippingMethod = {
        contains: shippingMethod,
        mode: "insensitive",
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        status: true,
        state: true,
        customer: true,
        reservation: {
          include: {
            customer: true,
            paymentMethod: true,
          },
        },
        orderItems: {
          where:
            user.userType === "partner"
              ? { source: { partnerId: user.id } }
              : undefined,
          include: {
            state: true,
            status: true,
            product: {
              select: {
                name: true,
              },
            },
            source: {
              include: {
                partner: true,
              },
            },
          },
        },
        loyaltyPoints: true,
        paymentMethod: true,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalOrders = await prisma.order.count({ where: whereClause });

    return NextResponse.json(
      { message: "Orders retrieved", orders, totalOrders },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to retrieve orders" },
      { status: 500 },
    );
  }
}
