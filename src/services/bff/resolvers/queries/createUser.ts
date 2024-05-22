import { User } from "@/types/user";
import { prismaClient } from "@/libs/prismaClient";

type CreateUserPayload = {
  user?: User;
  success: boolean;
  message?: string;
};

export const createUser = async (newUser: any): Promise<CreateUserPayload> => {
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

    const user = await prismaClient.user.create({
      data: { ...newUser, role: "agent", status: "pending" },
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
