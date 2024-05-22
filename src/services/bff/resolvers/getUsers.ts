import { User } from "@/types/user";
import { prismaClient } from "@/libs/prismaClient";

interface GetUsersPayload {
  users?: User[];
  success: boolean;
  message?: string;
}

export const getUsers = async (): Promise<GetUsersPayload> => {
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
