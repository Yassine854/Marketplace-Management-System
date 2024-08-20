import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";

export const PUT = async (request: NextRequest) => {
  try {
    const { status, username } = await request.json();

    if (!username) {
      return responses.invalidRequest("username is Required");
    }
    if (!status) {
      return responses.invalidRequest("status is Required");
    }

    let user = await prisma.getUser(username);

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    if (status === "active") {
      await prisma.editUser(username, { isActive: true });
    }
    if (status === "inactive") {
      await prisma.editUser(username, { isActive: false });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
};
