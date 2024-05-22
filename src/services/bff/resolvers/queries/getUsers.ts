import { UsersPayload } from "../resolvers.types";
import { prismaClient } from "@/libs/prismaClient";

export const getUsers = async (): Promise<UsersPayload> => {
  try {
    const users = await prismaClient.user.findMany();

    if (users.length > 0) {
      return {
        users,
        success: true,
        message: "Users fetched successfully",
      };
    } else {
      return {
        success: true,
        message: "No users found",
      };
    }
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching users",
    };
  }
};
