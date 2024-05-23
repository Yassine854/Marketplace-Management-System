import { UsersPayload } from "../resolvers.types";
import { getPrismaUsers } from "@/libs/prisma/getPrismaUsers";

export const getUsers = async (): Promise<UsersPayload> => {
  try {
    const users = await getPrismaUsers();

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
