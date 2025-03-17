import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all agents
export async function GET(req: Request) {
  try {
    const agents = await prisma.agent.findMany(); // Retrieve all agents

    if (agents.length === 0) {
      // Return a 200 with an empty array instead of a 404
      return NextResponse.json(
        { message: "No agents found", agents: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Agents retrieved successfully", agents },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to retrieve agents" },
      { status: 500 },
    );
  }
}
