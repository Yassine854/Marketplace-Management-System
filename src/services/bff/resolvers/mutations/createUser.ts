import { UserPayload } from "../resolvers.types";
import { hashPassword } from "@/utils/hashPassword";
import { prismaClient } from "@/libs/prisma/prismaClient";

export const createUser = async (newUser: any): Promise<UserPayload> => {
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { username: newUser.username },
    });

    if (existingUser) {
      return {
        user: undefined,
        success: false,
        message: "User already exists",
      };
    }

    const hashedPassword = await hashPassword(newUser.password);

    const user = await prismaClient.user.create({
      data: {
        ...newUser,
        password: hashedPassword,
        role: "agent",
        status: "pending",
      },
    });

    return {
      user,
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      user: undefined,
      success: false,
      message: error.message || "An error occurred while creating the user",
    };
  }
};
