export * from "./getUser";
export * from "./prismaClient";

import { getUser } from "./getUser";
import { editUser } from "./editUser";
import { getAllUsers } from "./getAllUsers";
import { getAllOrdersLogs } from "./getAllOrdersLogs";
import { getAllMilkRunAuditLogs } from "./getAllMilkRunAuditLogs";
import { getAllLogs } from "./getAllLog";

export const prisma = {
  getUser,
  editUser,
  getAllUsers,
  getAllOrdersLogs,
  getAllMilkRunAuditLogs,
  getAllLogs,
};
