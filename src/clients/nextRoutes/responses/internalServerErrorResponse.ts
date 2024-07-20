import { NextResponse } from "next/server";

export const internalServerErrorResponse = () =>
  NextResponse.json(
    {
      error: "An unexpected error occurred while processing the request.",
    },
    {
      status: 500,
    },
  );
