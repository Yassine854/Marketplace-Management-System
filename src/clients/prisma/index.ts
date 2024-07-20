export * from "./prismaClient";
export * from "./getUser";

import { getAllUsers } from "./getAllUsers";
import { getUser } from "./getUser";

export const prisma = {
  getAllUsers,
  getUser,
};
