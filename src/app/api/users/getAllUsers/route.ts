import { getAllUsers } from "@/services/users/getAllUsers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const result = await getAllUsers();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 },
    );
  }
};
