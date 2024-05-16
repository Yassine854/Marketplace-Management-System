import { gql } from "graphql-tag";

export const typeDefs = gql`
  type OrderLine {
    id: ID
    orderId: ID
    productId: ID
    productName: String
    quantity: Float
    productPrice: Float
    totalPrice: Float
    sku: String
  }

  type Order {
    id: ID!
    kamiounId: String!
    state: String!
    status: String!
    total: Float!
    createdAt: Float!
    customerId: ID
    customerFirstname: String
    customerLastname: String
    deliveryAgentId: String!
    deliveryAgent: String!
    deliveryDate: Float!
    source: String!
    lines: [OrderLine!]!
  }

  type OrderList {
    orders: [Order]
    totalOrders: Int
  }

  type Query {
    getOrder(orderId: ID!): Order
    getOrders(
      status: String
      page: Int
      perPage: Int
      sortBy: String
      search: String
    ): OrderList
  }
`;
