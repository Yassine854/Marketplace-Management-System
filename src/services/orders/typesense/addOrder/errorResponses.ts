import { NextResponse } from "next/server";

export const successResponse = (orderId: string) =>
  NextResponse.json(
    {
      message: "Order successfully updated.",
      orderId,
    },
    {
      status: 200,
    },
  );

export const notFoundResponse = (message: string) => {
  const parts = message.split("with id:");

  const id = parts[1].trim();

  return NextResponse.json(
    {
      error: "Order not found.",
      orderId: id,
    },
    {
      status: 404,
    },
  );
};

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

export const unauthorizedErrorResponse = () =>
  NextResponse.json(
    {
      error: "Unauthorized",
      message: "API key is missing or invalid.",
    },
    {
      status: 401,
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

export const addOrderConflictResponse = () =>
  NextResponse.json(
    {
      error: "Order already exists.",
    },
    {
      status: 409,
    },
  );
