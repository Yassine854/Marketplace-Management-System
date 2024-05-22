import { UserPayload } from "../resolvers.types";
import { prismaClient } from "@/libs/prismaClient";

export const deleteUser = async (userId: string): Promise<UserPayload> => {
  try {
    const userToDelete = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await prismaClient.user.delete({
      where: { id: userId },
    });

    return {
      user: userToDelete,
      success: true,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: error.message || "An error occurred while deleting the user",
    };
  }
};
