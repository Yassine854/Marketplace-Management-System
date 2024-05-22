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
    deliveryStatus: String
    source: String!
    lines: [OrderLine!]!
  }

  type OrderList {
    orders: [Order]
    totalOrders: Int
  }

  type User {
    id: ID!
    username: String!
    email: String
    password: String!
    role: String!
    warehouses: [String]!
  }

  type Role {
    id: ID!
    name: String!
    permissions: [String]!
  }

  type Query {
    getOrder(orderId: ID!): Order
    getOrders(
      page: Int
      perPage: Int
      sortBy: String
      filterBy: String
      search: String
    ): OrderList

    getUser(username: String!): User
    getUsers: [User]!
  }

  type Mutation {
    createUser(username: String!, email: String, password: String!): String!
    changeUserPassword(userId: ID!, newPassword: String!): String!
    editUsername(userId: ID!, newUsername: String!): String!
    changeUserEmail(userId: ID!, newEmail: String!): String!
    deleteUser(userId: ID!): String!
  }
`;
