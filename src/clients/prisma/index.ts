export * from "./getUser";
export * from "./prismaClient";

import { getUser } from "./getUser";
import { editUser } from "./editUser";
import { getAllUsers } from "./getAllUsers";
import { getAllOrdersLogs } from "./getAllOrdersLogs";

export const prisma = {
  getUser,
  editUser,
  getAllUsers,
  getAllOrdersLogs,
};
