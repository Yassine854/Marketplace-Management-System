import { gql } from "graphql-tag";

export const typeDefs = gql`
  input CreateUserInput {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    roleId: String!
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

  type OrderItem {
    id: ID
    orderId: ID
    productId: ID
    productName: String
    productPrice: Float
    totalPrice: Float
    sku: String
    weight: Float
    orderedQuantity: Float
  }

  type Order {
    id: ID!
    incrementId: String!
    kamiounId: String!
    storeId: String!
    state: String!
    status: String!
    total: Float!
    createdAt: Float!
    customerId: ID
    customerFirstname: String
    customerLastname: String
    customerPhone: String
    deliveryAgentId: String
    deliveryAgentName: String
    deliveryDate: Float
    deliveryStatus: String
    source: String!
    items: [OrderItem]
  }

  type OrderList {
    orders: [Order]
    totalOrders: Int
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    password: String!
    roleId: String!
    createdAt: String!
  }

  type Query {
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
    editUser(
      username: String!
      firstName: String!
      lastName: String!
      roleId: String!
      newPassword: String!
    ): UserPayload!
  }
`;
