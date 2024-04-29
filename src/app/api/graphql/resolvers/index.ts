import { GetOrdersParams, getOrders } from "./getOrders";

import { getOrder } from "./getOrder";

export const resolvers = {
  Query: {
    getOrders: (parent: any, args: GetOrdersParams) => getOrders(args),
    getOrder: (parent: any, args: { id: string }) => getOrder(args.id),
  },
};
