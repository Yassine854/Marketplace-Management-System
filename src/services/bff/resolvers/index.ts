import { GetOrdersParams, getOrders } from "./queries/getOrders";
import { createUser } from "./mutations/createUser";
import { deleteUser } from "./mutations/deleteUser";
import { getUser } from "./queries/getUser";
import { getUsers } from "./queries/getUsers";
import { editUser } from "./mutations/editUser";

export const resolvers = {
  Mutation: {
    createUser: (parent: any, args: any) => createUser(args.input),
    deleteUser: (parent: any, args: any) => deleteUser(args.userId),

    editUser: (parent: any, args: any) => editUser({ ...args }),
  },
  Query: {
    getOrders: (parent: any, args: GetOrdersParams) => getOrders(args),

    getUser: (parent: any, args: { username: string }) =>
      getUser(args.username),
    getUsers: (parent: any, args: any) => getUsers(),
  },
};
