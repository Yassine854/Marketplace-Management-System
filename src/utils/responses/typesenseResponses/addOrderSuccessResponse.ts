import { NextResponse } from "next/server";

export const addOrderSuccessResponse = (orderId: string) =>
  NextResponse.json(
    {
      message: "Order successfully added.",
      orderId,
    },
    {
      status: 201,
    },
  );
