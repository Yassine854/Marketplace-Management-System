// app/api/states/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single VendorOrder by ID (only if partner is user)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = session.user as { id: string };
    const { id } = params;

    const vendorOrder = await prisma.vendorOrder.findFirst({
      where: { id, partnerId: user.id },
      include: {
        status: true,
        state: true,
        partner: { include: { settings: true } },
        order: {
          include: { customer: true, paymentMethod: true },
        },
        orderAgent: true,
      },
    });

    if (!vendorOrder) {
      return NextResponse.json(
        { message: "VendorOrder not found or forbidden" },
        { status: 404 },
      );
    }

    let enrichedItemsSnapshot = [];
    let order_total_ht = 0;
    let order_total_ttc = 0;

    if (
      Array.isArray(vendorOrder.itemsSnapshot) &&
      vendorOrder.itemsSnapshot.length > 0
    ) {
      // Collect all unique IDs for batch queries
      const productIds = Array.from(
        new Set(
          vendorOrder.itemsSnapshot
            .map((item: any) => item.productId)
            .filter(Boolean),
        ),
      );
      const sourceIds = Array.from(
        new Set(
          vendorOrder.itemsSnapshot
            .map((item: any) => item.sourceId)
            .filter(Boolean),
        ),
      );

      // Batch fetch all products with tax info
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          sku: true,
          tax: { select: { value: true } },
        },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Batch fetch all sources
      const sources = await prisma.source.findMany({
        where: { id: { in: sourceIds } },
        select: { id: true, name: true },
      });
      const sourceMap = new Map(sources.map((s) => [s.id, s]));

      // Batch fetch all skuPartners for this partner and products
      const skuPartners = await prisma.skuPartner.findMany({
        where: {
          productId: { in: productIds },
          partnerId: vendorOrder.partnerId,
        },
        select: { id: true, productId: true },
      });
      const skuPartnerMap = new Map(
        skuPartners.map((sp) => [sp.productId, sp]),
      );

      // Batch fetch all stocks
      const skuPartnerIds = skuPartners.map((sp) => sp.id);
      const stocks = await prisma.stock.findMany({
        where: {
          skuPartnerId: { in: skuPartnerIds },
          sourceId: { in: sourceIds },
        },
        select: {
          skuPartnerId: true,
          sourceId: true,
          price: true,
          special_price: true,
          sealable: true,
        },
      });
      const stockMap = new Map(
        stocks.map((s) => [`${s.skuPartnerId}-${s.sourceId}`, s]),
      );

      // Process items with cached data
      enrichedItemsSnapshot = vendorOrder.itemsSnapshot.map((item: any) => {
        const product = productMap.get(item.productId);
        const source = sourceMap.get(item.sourceId);
        const skuPartner = skuPartnerMap.get(item.productId);
        const stock = skuPartner
          ? stockMap.get(`${skuPartner.id}-${item.sourceId}`)
          : null;

        const unitPrice = stock ? stock.special_price ?? stock.price : null;
        const specialPrice = stock?.special_price || null;
        const sealable = stock?.sealable || null;
        const tva = product?.tax?.value ?? 0;
        const qteOrdered = item.qteOrdered ?? 1;
        const price = specialPrice ?? unitPrice ?? 0;
        const total_ht = qteOrdered * price;
        const total_ttc = tva ? total_ht + total_ht * (tva / 100) : total_ht;

        order_total_ht += total_ht;
        order_total_ttc += total_ttc;

        return {
          ...item,
          productName: product?.name || "",
          sku: product?.sku || item.sku || "",
          sourceName: source?.name || "",
          unitPrice,
          specialPrice,
          sealable,
          tva,
          total_ht,
          total_ttc,
        };
      });
    }

    const responseVendorOrder = {
      ...vendorOrder,
      itemsSnapshot: enrichedItemsSnapshot,
      order_total_ht,
      order_total_ttc,
    };

    return NextResponse.json(
      {
        message: "VendorOrder retrieved successfully",
        vendorOrder: responseVendorOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching vendor order:", error);
    return NextResponse.json(
      { error: "Failed to retrieve vendor order" },
      { status: 500 },
    );
  }
}

// PATCH: Update VendorOrder's itemsSnapshot and update corresponding OrderItems
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = session.user as { id: string };
    const { id } = params;
    const body = await req.json();

    // Only allow if partnerId matches user.id
    const vendorOrder = await prisma.vendorOrder.findFirst({
      where: { id, partnerId: user.id },
      include: { partner: { include: { settings: true } } },
    });

    if (!vendorOrder) {
      return NextResponse.json(
        { message: "VendorOrder not found or forbidden" },
        { status: 404 },
      );
    }

    const updateData: any = {};

    if (body.itemsSnapshot !== undefined) {
      const currentSnapshot = Array.isArray(vendorOrder.itemsSnapshot)
        ? vendorOrder.itemsSnapshot
        : [];
      const updatesById = Object.fromEntries(
        body.itemsSnapshot.map((item: any) => [item.id, item.qteOrdered]),
      );

      const newSnapshot = currentSnapshot.map((item: any) =>
        updatesById[item.id] !== undefined
          ? { ...item, qteOrdered: updatesById[item.id] }
          : item,
      );
      updateData.itemsSnapshot = newSnapshot;

      // Batch operations for better performance
      const productIds = Array.from(
        new Set(newSnapshot.map((item: any) => item.productId).filter(Boolean)),
      );
      const sourceIds = Array.from(
        new Set(newSnapshot.map((item: any) => item.sourceId).filter(Boolean)),
      );

      // Batch fetch products with tax info
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, tax: { select: { value: true } } },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Batch fetch skuPartners
      const skuPartners = await prisma.skuPartner.findMany({
        where: {
          productId: { in: productIds },
          partnerId: vendorOrder.partnerId,
        },
        select: { id: true, productId: true },
      });
      const skuPartnerMap = new Map(
        skuPartners.map((sp) => [sp.productId, sp]),
      );

      // Batch fetch stocks
      const skuPartnerIds = skuPartners.map((sp) => sp.id);
      const stocks = await prisma.stock.findMany({
        where: {
          skuPartnerId: { in: skuPartnerIds },
          sourceId: { in: sourceIds },
        },
        select: {
          skuPartnerId: true,
          sourceId: true,
          price: true,
          special_price: true,
        },
      });
      const stockMap = new Map(
        stocks.map((s) => [`${s.skuPartnerId}-${s.sourceId}`, s]),
      );

      // Calculate total with cached data
      let totalHT = 0;
      let totalTVA = 0;

      for (const item of newSnapshot) {
        if (item.productId && item.sourceId) {
          const product = productMap.get(item.productId);
          const skuPartner = skuPartnerMap.get(item.productId);
          const stock = skuPartner
            ? stockMap.get(`${skuPartner.id}-${item.sourceId}`)
            : null;

          if (stock && product) {
            const price =
              stock.special_price !== null && stock.special_price !== undefined
                ? stock.special_price
                : stock.price ?? 0;
            const tva = product.tax?.value ?? 0;
            const qteOrdered = item.qteOrdered ?? 1;

            const itemTotalHT = qteOrdered * price;
            const itemTotalTVA = itemTotalHT * (tva / 100);

            totalHT += itemTotalHT;
            totalTVA += itemTotalTVA;
          }
        }
      }

      const deliveryFees = parseFloat(
        vendorOrder.partner?.settings[0]?.deliveryTypeAmount || "0",
      );
      const finalTotalTTC = totalHT + totalTVA + deliveryFees;
      updateData.total = finalTotalTTC;

      // Batch update OrderItems
      const orderItemUpdates = body.itemsSnapshot
        .filter((item: any) => item.id && item.qteOrdered !== undefined)
        .map((item: any) =>
          prisma.orderItem.update({
            where: { id: item.id },
            data: { qteOrdered: item.qteOrdered },
          }),
        );

      // Batch update Stock sealable values
      const stockUpdates = [];
      for (const item of body.itemsSnapshot) {
        if (item.sealable !== undefined && item.productId && item.sourceId) {
          const skuPartner = skuPartnerMap.get(item.productId);
          if (skuPartner) {
            stockUpdates.push(
              prisma.stock.updateMany({
                where: {
                  sourceId: item.sourceId,
                  skuPartnerId: skuPartner.id,
                },
                data: { sealable: item.sealable },
              }),
            );
          }
        }
      }

      // Execute all updates in parallel
      await Promise.all(orderItemUpdates.concat(stockUpdates));
    }

    if (body.stateId !== undefined) updateData.stateId = body.stateId;
    if (body.statusId !== undefined) updateData.statusId = body.statusId;

    const updatedVendorOrder = await prisma.vendorOrder.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "VendorOrder and OrderItems updated successfully",
        vendorOrder: updatedVendorOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating vendor order:", error);
    return NextResponse.json(
      { error: "Failed to update vendor order" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a state by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    // Get user's role
    const userRole = await prisma.role.findFirst({
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

      const canAccess = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "State" && rp.actions.includes("delete"),
      );

      if (!canAccess) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for State" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    await prisma.state.delete({ where: { id } });

    return NextResponse.json(
      { message: "State deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting state:", error);
    return NextResponse.json(
      { error: "Failed to delete state" },
      { status: 500 },
    );
  }
}
