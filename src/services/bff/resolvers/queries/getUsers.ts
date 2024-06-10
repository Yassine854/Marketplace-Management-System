import { UsersPayload } from "../resolvers.types";
import { getPrismaAllUsers } from "@/libs/prisma/getPrismaAllUsers";

export const getUsers = async (): Promise<UsersPayload> => {
  try {
    const users = await getPrismaAllUsers();

    if (users && users?.length > 0) {
      return {
        //@ts-ignore
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
    process.env.NODE_ENV === "development" &&
      console.error("Error fetching users:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching users",
    };
  }
};
