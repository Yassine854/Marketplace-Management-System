import { UserPayload } from "../resolvers.types";
import { getPrismaUser } from "@/libs/prisma";

export const getUser = async (username: string): Promise<UserPayload> => {
  try {
    const user = await getPrismaUser(username);

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
