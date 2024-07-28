import { UserPayload } from "../resolvers.types";
import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/clients/prisma/prismaClient";

export const editUser = async ({
  username,
  firstName,
  lastName,
  roleId,
  newPassword,
}: any): Promise<UserPayload> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { username },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await prismaClient.user.update({
      where: { username },
      data: { firstName, lastName, roleId },
    });
    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);

      await prismaClient.user.update({
        where: { username },
        data: { password: hashedPassword },
      });
    }

    return {
      //@ts-ignore
      user: user,
      success: true,
      message: "User updated successfully",
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
