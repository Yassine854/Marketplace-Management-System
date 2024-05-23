import { UserPayload } from "../resolvers.types";
import { prismaClient } from "@/libs/prisma/prismaClient";

export const changeUserRole = async (
  userId: string,
  newRole: string,
): Promise<UserPayload> => {
  try {
    const userToUpdate = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userToUpdate) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return {
      user: updatedUser,
      success: true,
      message: "User role updated successfully",
    };
  } catch (error: any) {
    console.error("Error changing user role:", error);
    return {
      success: false,
      message:
        error.message || "An error occurred while changing the user role",
    };
  }
};
