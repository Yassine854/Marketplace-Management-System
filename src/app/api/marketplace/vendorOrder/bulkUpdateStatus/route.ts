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
