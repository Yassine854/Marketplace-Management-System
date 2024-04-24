import { GetOrdersParams, getOrders } from "./getOrders";

export const resolvers = {
  Query: {
    getOrders: (parent: any, args: GetOrdersParams) => getOrders(args),
  },
};
