import { NextResponse } from "next/server";

export const addOrderConflictResponse = () =>
  NextResponse.json(
    {
      error: "Order already exists.",
    },
    {
      status: 409,
    },
  );
