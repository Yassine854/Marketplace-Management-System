import { prisma } from "@/clients/prisma";

export const getUser = async (username: string) => {
  try {
    const user = await prisma.getUser(username);

    if (user) {
      return {
        message: "User fetched successfully",
        user,
      };
    } else {
      return {
        message: "User not found",
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      process.env.NODE_ENV === "development" &&
        console.error("Error fetching user:", error.message);
      return {
        message: error.message,
      };
    } else {
      process.env.NODE_ENV === "development" &&
        console.error("Unknown error fetching user");
      return {
        message: "An unknown error occurred while fetching the user",
      };
    }
  }
};
