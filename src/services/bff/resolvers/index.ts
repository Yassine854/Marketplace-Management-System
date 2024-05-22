import { GetOrdersParams, getOrders } from "./queries/getOrders";

import { changeUserEmail } from "./mutations/changeUserEmail";
import { changeUserPassword } from "./mutations/changeUserPassword";
import { changeUserRole } from "./mutations/changeUserRole";
import { changeUserWarehouses } from "./mutations/changeUserWarehouses";
import { createUser } from "./mutations/createUser";
import { deleteUser } from "./mutations/deleteUser";
import { getOrder } from "./queries/getOrder";
import { getUser } from "./queries/getUser";
import { getUsers } from "./queries/getUsers";

export const resolvers = {
  Mutation: {
    createUser: (parent: any, args: any) => createUser(args.input),
    deleteUser: (parent: any, args: any) => deleteUser(args.userId),
    changeUserEmail: (parent: any, args: any) =>
      changeUserEmail(args.userId, args.newEmail),
    changeUserPassword: (parent: any, args: any) =>
      changeUserPassword(args.userId, args.newPassword),
    changeUserRole: (parent: any, args: any) =>
      changeUserRole(args.userId, args.newRole),
    changeUserWarehouses: (parent: any, args: any) =>
      changeUserWarehouses(args.userId, args.newRole),
  },
  Query: {
    getOrders: (parent: any, args: GetOrdersParams) => getOrders(args),
    getOrder: (parent: any, args: { orderId: string }) =>
      getOrder(args.orderId),
    getUser: (parent: any, args: { username: string }) =>
      getUser(args.username),
    getUsers: (parent: any, args: any) => getUsers(),
  },
};
