import { getAllUsers } from "@/services/users/getAllUsers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const users = await getAllUsers();
    console.log("🚀 ~ GET ~ users:", users);

    return NextResponse.json(
      {
        message: "success",
        users,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 },
    );
  }
};
