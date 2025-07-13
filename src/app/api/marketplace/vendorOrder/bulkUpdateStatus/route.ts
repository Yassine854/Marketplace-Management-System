import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { orderIds, newStatus, newState } = await req.json();
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
