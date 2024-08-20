export * from "./getUser";
export * from "./prismaClient";

import { getUser } from "./getUser";
import { editUser } from "./editUser";
import { getAllUsers } from "./getAllUsers";

export const prisma = {
  getUser,
  editUser,
  getAllUsers,
};
