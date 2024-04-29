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
    id: ID
    customer: Customer
    total: Float
    deliveryDate: String
    lines: [OrderLine]
  }

  type Customer {
    id: ID
    name: String
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
