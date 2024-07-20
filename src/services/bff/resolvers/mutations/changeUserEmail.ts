import { UserPayload } from "../resolvers.types";
import { prismaClient } from "@/clients/prisma/prismaClient";

export const changeUserEmail = async (
  userId: string,
  newEmail: string,
): Promise<UserPayload> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return {
      //@ts-ignore
      user: updatedUser,
      success: true,
      message: "Email updated successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      process.env.NODE_ENV === "development" &&
        console.error("Error updating email:", error.message);
      return {
        success: false,
        message: error.message,
      };
    } else {
      process.env.NODE_ENV === "development" &&
        console.error("Unknown error updating email");
      return {
        success: false,
        message: "An unknown error occurred while updating the email",
      };
    }
  }
};
