import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    getOrders(
      status: String!
      page: Int!
      perPage: Int!
      sortBy: String!
    ): OrderList!
  }

  type Order {
    id: String
    customer: Customer
    total: Float
    deliveryDate: String
  }

  type Customer {
    name: String!
    id: String
  }

  type OrderList {
    orders: [Order]!
    totalOrders: Int!
  }
`;
