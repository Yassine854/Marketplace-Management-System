import { UserPayload } from "../resolvers.types";
import { prismaClient } from "@/clients/prisma/prismaClient";

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
      //@ts-ignore
      data: { roleCode: newRole },
    });

    return {
      //@ts-ignore
      user: updatedUser,
      success: true,
      message: "User role updated successfully",
    };
  } catch (error: any) {
    process.env.NODE_ENV === "development" &&
      console.error("Error changing user role:", error);
    return {
      success: false,
      message:
        error.message || "An error occurred while changing the user role",
    };
  }
};
