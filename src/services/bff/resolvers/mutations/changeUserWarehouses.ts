import { UserPayload } from "../resolvers.types";
import { prismaClient } from "@/libs/prismaClient";

export const changeUserWarehouses = async (
  userId: string,
  newWarehouses: string[],
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
      data: { warehouses: { set: newWarehouses } },
    });

    return {
      user: updatedUser,
      success: true,
      message: "User warehouses updated successfully",
    };
  } catch (error: any) {
    console.error("Error changing user warehouses:", error);
    return {
      success: false,
      message:
        error.message || "An error occurred while changing the user warehouses",
    };
  }
};
