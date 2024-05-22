import { GetOrdersParams, getOrders } from "./getOrders";

import { getOrder } from "./getOrder";
import { getUser } from "./getUser";
import { getUsers } from "./getUsers";

export const resolvers = {
  Query: {
    getOrders: (parent: any, args: GetOrdersParams) => getOrders(args),
    getOrder: (parent: any, args: { orderId: string }) =>
      getOrder(args.orderId),
    getUser: (parent: any, args: { username: string }) =>
      getUser(args.username),
    getUsers: (parent: any, args: any) => getUsers(),
  },
};
