import { NextResponse } from "next/server";

export const successResponse = (orderId: string) =>
  NextResponse.json(
    {
      message: "Order successfully added.",
      orderId,
    },
    {
      status: 201,
    },
  );

export const invalidRequestResponse = (message: string) => {
  const parts = message.split("Server said:");

  const serverSaidPart = parts[1].trim();

  return NextResponse.json(
    {
      error: "Invalid request.",
      details: serverSaidPart,
    },
    {
      status: 400,
    },
  );
};

export const UnauthorizedErrorResponse = () =>
  NextResponse.json(
    {
      error: "Unauthorized. Invalid API key.",
    },
    {
      status: 401,
    },
  );

export const conflictResponse = () =>
  NextResponse.json(
    {
      error: "Order already exists.",
    },
    {
      status: 409,
    },
  );

export const internalServerErrorResponse = () =>
  NextResponse.json(
    {
      error: "An unexpected error occurred while processing the request.",
    },
    {
      status: 500,
    },
  );
