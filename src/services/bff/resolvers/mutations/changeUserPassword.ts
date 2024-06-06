import { UserPayload } from "../resolvers.types";
import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/libs/prisma/prismaClient";

export const changeUserPassword = async (
  userId: string,
  newPassword: string,
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

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      //@ts-ignore
      user: updatedUser,
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      process.env.NODE_ENV === "development" &&
        console.error("Error updating password:", error.message);
      return {
        success: false,
        message: error.message,
      };
    } else {
      process.env.NODE_ENV === "development" &&
        console.error("Unknown error updating password");
      return {
        success: false,
        message: "An unknown error occurred while updating the password",
      };
    }
  }
};
