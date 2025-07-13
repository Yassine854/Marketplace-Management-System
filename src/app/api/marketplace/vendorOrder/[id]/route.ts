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
        partner: true,
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
    // Enrich itemsSnapshot with productName, sourceName, stockQuantity
    let enrichedItemsSnapshot = [];
    let order_total_ht = 0;
    let order_total_ttc = 0;
    if (Array.isArray(vendorOrder.itemsSnapshot)) {
      enrichedItemsSnapshot = await Promise.all(
        vendorOrder.itemsSnapshot.map(async (item: any) => {
          // Get product details (including tax)
          const product = item.productId
            ? await prisma.product.findUnique({
                where: { id: item.productId },
                select: {
                  name: true,
                  sku: true,
                  tax: { select: { value: true } },
                },
              })
            : null;

          // Get source details
          const source = item.sourceId
            ? await prisma.source.findUnique({
                where: { id: item.sourceId },
                select: { name: true },
              })
            : null;

          // Get stock details
          let unitPrice = null;
          let specialPrice = null;
          let sealable = null;
          if (item.productId && item.sourceId) {
            const skuPartner = await prisma.skuPartner.findFirst({
              where: {
                productId: item.productId,
                partnerId: vendorOrder.partnerId,
              },
            });
            if (skuPartner) {
              const stock = await prisma.stock.findFirst({
                where: {
                  sourceId: item.sourceId,
                  skuPartnerId: skuPartner.id,
                },
              });
              if (stock) {
                unitPrice = stock.special_price ?? stock.price;
                specialPrice = stock.special_price;
                sealable = stock.sealable;
              }
            }
          }
          // TVA (tax value)
          const tva = product?.tax?.value ?? 0;
          // Use qteOrdered from item, fallback to 1 if missing
          const qteOrdered = item.qteOrdered ?? 1;
          // Use specialPrice if available, else unitPrice
          const price = specialPrice ?? unitPrice ?? 0;
          // total_ht: qteOrdered * price
          const total_ht = qteOrdered * price;
          // total_ttc: total_ht + (total_ht * (tva / 100)), or just total_ht if tva is 0/null
          const total_ttc = tva ? total_ht + total_ht * (tva / 100) : total_ht;
          // Add to order totals
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
        }),
      );
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
    });
    if (!vendorOrder) {
      return NextResponse.json(
        { message: "VendorOrder not found or forbidden" },
        { status: 404 },
      );
    }
    // Update itemsSnapshot, stateId, and statusId in VendorOrder
    const updateData: any = {};
    if (body.itemsSnapshot !== undefined) {
      // Fetch current snapshot
      const currentSnapshot = Array.isArray(vendorOrder.itemsSnapshot)
        ? vendorOrder.itemsSnapshot
        : [];
      // Create a map of updated items by id
      const updatesById = Object.fromEntries(
        body.itemsSnapshot.map((item: any) => [item.id, item.qteOrdered]),
      );
      // Update only the qteOrdered for matching items
      const newSnapshot = currentSnapshot.map((item: any) =>
        updatesById[item.id] !== undefined
          ? { ...item, qteOrdered: updatesById[item.id] }
          : item,
      );
      updateData.itemsSnapshot = newSnapshot;
      // Also update qteOrdered in OrderItem for each changed item
      for (const item of body.itemsSnapshot) {
        const { id: itemId, qteOrdered, sealable, productId, sourceId } = item;
        if (itemId && qteOrdered !== undefined) {
          await prisma.orderItem.update({
            where: { id: itemId },
            data: { qteOrdered: qteOrdered },
          });
        }
        // Update sealable in Stock if present
        if (
          sealable !== undefined &&
          productId &&
          sourceId &&
          vendorOrder.partnerId
        ) {
          const skuPartner = await prisma.skuPartner.findFirst({
            where: {
              productId: productId,
              partnerId: vendorOrder.partnerId,
            },
          });
          if (skuPartner) {
            await prisma.stock.updateMany({
              where: {
                sourceId: sourceId,
                skuPartnerId: skuPartner.id,
              },
              data: { sealable: sealable },
            });
          }
        }
      }
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
