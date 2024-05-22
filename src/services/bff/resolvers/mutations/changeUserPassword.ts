import { UserPayload } from "../resolvers.types";
import bcrypt from "bcrypt";
import { prismaClient } from "@/libs/prismaClient";

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

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      user: updatedUser,
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating password:", error.message);
      return {
        success: false,
        message: error.message,
      };
    } else {
      console.error("Unknown error updating password");
      return {
        success: false,
        message: "An unknown error occurred while updating the password",
      };
    }
  }
};
