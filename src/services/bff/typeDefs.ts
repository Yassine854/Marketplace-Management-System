import { gql } from "graphql-tag";

export const typeDefs = gql`
  input CreateUserInput {
    username: String!
    email: String
    password: String!
    firstName: String!
    lastName: String!
    roleId: String!
    warehouseId: String!
  }

  type UserPayload {
    user: User
    success: Boolean!
    message: String
  }

  type UsersPayload {
    users: [User]
    success: Boolean!
    message: String
  }

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
    roleId: String!
    warehouseId: String!
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

    getUser(username: String!): UserPayload!
    getUsers: UsersPayload!
  }

  type Mutation {
    createUser(input: CreateUserInput): UserPayload!
    deleteUser(userId: ID!): UserPayload!
    changeUserPassword(userId: ID!, newPassword: String!): UserPayload!
    changeUserEmail(userId: ID!, newEmail: String!): UserPayload!
    changeUserRole(userId: ID!, newRole: String!): UserPayload!
    changeUserWarehouses(userId: ID!, newWarehouses: [String]!): UserPayload!
  }
`;
