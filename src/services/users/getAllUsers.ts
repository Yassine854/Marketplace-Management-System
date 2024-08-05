import { prisma } from "@/clients/prisma";

export const getAllUsers = async () => {
  try {
    const users = await prisma.getAllUsers();

    if (users && users?.length > 0) {
      return {
        message: "Users fetched successfully",
        users,
      };
    } else {
      return {
        message: "No users found",
      };
    }
  } catch (error: any) {
    process.env.NODE_ENV === "development" &&
      console.error("Error fetching users:", error);
    return {
      message: error.message || "An error occurred while fetching users",
    };
  }
};
