import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const customerData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      telephone: formData.get("telephone") as string,
      address: formData.get("address") as string,
      governorate: formData.get("governorate") as string,
      gender: formData.get("gender")
        ? (formData.get("gender") as string)
        : null,
      password: await hash(formData.get("password") as string, 10),
    };

    const existingCustomer = await prisma.customers.findFirst({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    const newCustomer = await prisma.customers.create({
      data: customerData,
    });

    return NextResponse.json({ customer: newCustomer }, { status: 201 });
  } catch (error) {
    console.error("Creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
