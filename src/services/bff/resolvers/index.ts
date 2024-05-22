import { GetOrdersParams, getOrders } from "./getOrders";

import { createUser } from "./createUser";
import { getOrder } from "./getOrder";
import { getUser } from "./getUser";
import { getUsers } from "./getUsers";

export const resolvers = {
  Mutation: {
    createUser: (parent: any, args: any) => createUser(args.input),
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
