import { UserPayload } from "../resolvers.types";
import { prismaClient } from "@/libs/prisma/prismaClient";

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

    const updatedUser = {};

    // await prismaClient.user.update({
    //   where: { id: userId },
    //   data: { warehouseId: { set: newWarehouses } },
    // });

    return {
      //@ts-ignore
      user: updatedUser,
      success: true,
      message: "User warehouses updated successfully",
    };
  } catch (error: any) {
    process.env.NODE_ENV === "development" &&
      console.error("Error changing user warehouses:", error);
    return {
      success: false,
      message:
        error.message || "An error occurred while changing the user warehouses",
    };
  }
};
