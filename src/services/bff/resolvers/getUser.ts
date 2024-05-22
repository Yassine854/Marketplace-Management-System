import { User } from "@/types/user";
import { prismaClient } from "@/libs/prismaClient";

interface GetUserPayload {
  user?: User;
  success: boolean;
  message?: string;
}

export const getUser = async (username: string): Promise<GetUserPayload> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return {
        user,
        success: true,
        message: "User fetched successfully",
      };
    } else {
      return {
        success: false,
        message: "User not found",
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
      return {
        success: false,
        message: error.message,
      };
    } else {
      console.error("Unknown error fetching user");
      return {
        success: false,
        message: "An unknown error occurred while fetching the user",
      };
    }
  }
};
