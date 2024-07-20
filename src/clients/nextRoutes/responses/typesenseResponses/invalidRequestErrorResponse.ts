import { NextResponse } from "next/server";

export const invalidRequestErrorResponse = (message: string) => {
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
