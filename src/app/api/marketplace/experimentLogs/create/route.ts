import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import type { User } from "@/types/user";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session?.user as User;

    // Parse the request body
    const body = await req.json();
    const { experimentId, variationId } = body;

    // Validate input
    if (!experimentId || typeof variationId !== "number") {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Determine user type and set appropriate ID
    const userId = session.user.id;
    const userType = user.userType;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 },
      );
    }

    // Create data object based on user type
    let createData;

    if (userType === "partner") {
      createData = {
        experimentId,
        variationId,
        partnerId: userId,
      };
    } else if (userType === "admin") {
      createData = {
        experimentId,
        variationId,
        adminId: userId,
      };
    } else {
      return NextResponse.json(
        { message: "Invalid user type" },
        { status: 400 },
      );
    }

    // Create the ExperimentExposure
    const newExposure = await prisma.experimentExposure.create({
      data: createData,
    });

    return NextResponse.json(
      {
        message: "ExperimentExposure created successfully",
        experimentExposure: newExposure,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ExperimentExposure:", error);
    return NextResponse.json(
      { error: "Failed to create ExperimentExposure" },
      { status: 500 },
    );
  }
}
