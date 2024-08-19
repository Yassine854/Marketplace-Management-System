import { getAllOrdersLogs } from "@/services/orders/getOrdersLogs/getAllOrdersLogs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const ordersLogs = await getAllOrdersLogs();

    return NextResponse.json(
      {
        message: "success",
        ordersLogs,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch ordersLogs" },
      { status: 500 },
    );
  }
};
