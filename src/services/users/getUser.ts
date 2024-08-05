import { prisma } from "@/clients/prisma";
import { UserPayload } from "../bff/resolvers/resolvers.types";

export const getUser = async (username: string): Promise<UserPayload> => {
  try {
    const user = await prisma.getUser(username);

    if (user) {
      return {
        //@ts-ignore
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
      process.env.NODE_ENV === "development" &&
        console.error("Error fetching user:", error.message);
      return {
        success: false,
        message: error.message,
      };
    } else {
      process.env.NODE_ENV === "development" &&
        console.error("Unknown error fetching user");
      return {
        success: false,
        message: "An unknown error occurred while fetching the user",
      };
    }
  }
};
