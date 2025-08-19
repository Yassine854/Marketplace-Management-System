import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to check allowed transitions
function isTransitionAllowed(
  currentStatus: string | null | undefined,
  newStatus: string,
  newState?: string,
) {
  if (!currentStatus) return false;
  if (currentStatus === "open") {
    return (
      newStatus === "valid" ||
      (newStatus === "canceled" && newState === "canceled")
    );
  }
  if (currentStatus === "valid") {
    return (
      newStatus === "shipped" ||
      newStatus === "open" ||
      (newStatus === "canceled" && newState === "canceled")
    );
  }
  if (currentStatus === "shipped") {
    return (
      (newStatus === "unpaid" && newState === "complete") ||
      (newStatus === "canceled" && newState === "canceled") ||
      newStatus === "valid"
    );
  }
  if (currentStatus === "unpaid") {
    return newStatus === "delivered";
  }
  if (currentStatus === "delivered") {
    return newStatus === "archived" && newState === "complete";
  }
  if (currentStatus === "archived") {
    return newStatus === "closed" && newState === "closed";
  }
  return false;
}

// Process stock and order items when an order is delivered or canceled
async function processStockForOrder(
  orderId: string,
  action: "delivered" | "canceled",
) {
  try {
    const vendorOrder = await prisma.vendorOrder.findUnique({
      where: { id: orderId },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!vendorOrder || !vendorOrder.order?.orderItems?.length) return;

    for (const item of vendorOrder.order.orderItems) {
      const qty = item.qteOrdered ?? 0;
      if (qty <= 0) continue;

      if (action === "delivered") {
        // find a skuPartner that matches the item sku (either partner sku or product sku) and belongs to this vendor order partner
        const skuPartner = await prisma.skuPartner.findFirst({
          where: {
            partnerId: vendorOrder.partnerId,
            OR: [{ skuPartner: item.sku }, { skuProduct: item.sku }],
          },
        });
        if (!skuPartner) continue;

        // find stock for that skuPartner and the item's source
        const stock = await prisma.stock.findFirst({
          where: {
            skuPartnerId: skuPartner.id,
            // convert null to undefined so Prisma accepts the field type
            sourceId: item.sourceId ?? undefined,
            sealable: { gt: 0 },
          },
        });
        if (!stock) continue;

        // take up to the ordered qty but not more than available sealable
        const takeQty = Math.min(qty, stock.sealable ?? 0);

        await prisma.$transaction([
          prisma.stock.update({
            where: { id: stock.id },
            data: { sealable: { decrement: takeQty } },
          }),
          prisma.orderItem.update({
            where: { id: item.id },
            data: { qteShipped: { increment: takeQty } },
          }),
        ]);
      } else if (action === "canceled") {
        // only update order item qteCanceled
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { qteCanceled: { increment: qty } },
        });
      }
    }
  } catch (err) {
    console.error(`processStockForOrder(${orderId}, ${action}) error:`, err);
  }
}

export async function POST(req: Request) {
  try {
    const { orderIds, newStatus, newState, agentId } = await req.json();
    if (!Array.isArray(orderIds) || !newStatus) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    // Find the statusId for the given status name
    const statusRecord = await prisma.status.findFirst({
      where: { name: newStatus },
    });
    if (!statusRecord) {
      return NextResponse.json({ error: "Status not found" }, { status: 404 });
    }
    let stateId = undefined;
    if (newState) {
      const stateRecord = await prisma.state.findFirst({
        where: { name: newState },
      });
      if (!stateRecord) {
        return NextResponse.json({ error: "State not found" }, { status: 404 });
      }
      stateId = stateRecord.id;
    }
    // Fetch current statuses for all orders
    const orders = await prisma.vendorOrder.findMany({
      where: { id: { in: orderIds } },
      select: { id: true, status: { select: { name: true } } },
    });
    // Validate all transitions
    for (const order of orders) {
      if (!isTransitionAllowed(order.status?.name, newStatus, newState)) {
        return NextResponse.json(
          {
            error: `Invalid transition for order ${order.id} from ${order.status
              ?.name} to ${newStatus}${
              newState ? " with state " + newState : ""
            }`,
          },
          { status: 400 },
        );
      }
    }
    // If shipping and agentId provided, create AgentAssign and update orders
    if (newStatus === "shipped" && agentId) {
      // Create AgentAssign record
      const agentAssign = await prisma.agentAssign.create({
        data: {
          agentId,
        },
      });
      // Update all selected orders with status, state, and AgentAssignId
      await prisma.vendorOrder.updateMany({
        where: { id: { in: orderIds } },
        data: {
          statusId: statusRecord.id,
          ...(stateId ? { stateId } : {}),
          AgentAssignId: agentAssign.id,
        },
      });
      return NextResponse.json(
        { message: "Statuses updated and agent assigned successfully" },
        { status: 200 },
      );
    }
    // Default: just update status/state
    await prisma.vendorOrder.updateMany({
      where: { id: { in: orderIds } },
      data: {
        statusId: statusRecord.id,
        ...(stateId ? { stateId } : {}),
      },
    });
    // Process stock and order items for delivered or canceled status
    for (const orderId of orderIds) {
      if (newStatus === "delivered") {
        await processStockForOrder(orderId, "delivered");
      } else if (newStatus === "canceled") {
        await processStockForOrder(orderId, "canceled");
      }
    }
    return NextResponse.json(
      { message: "Statuses updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating statuses:", error);
    return NextResponse.json(
      { error: "Failed to update statuses" },
      { status: 500 },
    );
  }
}
