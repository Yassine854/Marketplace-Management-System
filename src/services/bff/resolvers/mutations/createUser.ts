import { UserPayload } from "../resolvers.types";
import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/libs/prisma/prismaClient";
import { warehouses } from "@/components/elements/TopNavBarElements/WarehouseSelector/WarehouseSelector";

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
        role: "admin",
        status: "pending",
        warehouses: ["tunis"],
        firstName: "Mohamed",
        lastName: "Jrad",
      },
    });

    return {
      user,
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    process.env.NODE_ENV === "development" &&
      console.error("Error creating user:", error);
    return {
      user: undefined,
      success: false,
      message: error.message || "An error occurred while creating the user",
    };
  }
};
