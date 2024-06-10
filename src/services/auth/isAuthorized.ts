import { NextRequest } from "next/server";

export const isAuthorized = (request: NextRequest): boolean => {
  const forwarded: string = request.headers.get("x-forwarded-for") ?? "";
  const key: string = request.headers.get("x-api-key") ?? "";

  return true;
};
