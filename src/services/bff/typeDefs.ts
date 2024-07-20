import { gql } from "graphql-tag";

export const typeDefs = gql`
  input CreateUserInput {
    username: String!
    email: String
    password: String!
    firstName: String!
    lastName: String!
    roleCode: String!
    warehouseCode: String!
  }

  type Warehouse {
    code: String!
    name: String!
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

  type WarehousesPayload {
    warehouses: [Warehouse]!
    success: Boolean!
    message: String
  }

  type OrderItem {
    id: ID
    orderId: ID
    productId: ID
    productName: String
    quantity: Float
    productPrice: Float
    totalPrice: Float
    sku: String
    shipped: Float
    pcb: Float
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
    deliveryAgentId: String!
    deliveryAgentName: String!
    deliveryDate: Float!
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
    email: String
    password: String!
    status: String!
    roleCode: String!
    warehouseCode: String!
    createdAt: String!
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
    getWarehouses: WarehousesPayload!
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
