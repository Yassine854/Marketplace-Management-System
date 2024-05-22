import { GetOrdersParams, getOrders } from "./queries/getOrders";

import { createUser } from "./queries/createUser";
import { getOrder } from "./queries/getOrder";
import { getUser } from "./getUser";
import { getUsers } from "./queries/getUsers";

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
