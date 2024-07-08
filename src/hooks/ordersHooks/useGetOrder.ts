import { gql, useQuery } from "@apollo/client";

import { ApolloError } from "@apollo/client";
import { Order } from "@/types/order";

export type Params = {
  status: string;
  page: number;
  perPage: number;
  sortBy: string;
  search: string;
};

type Orders = {
  orders: Order[];
  total: number;
};

type Res = {
  data: Order;
  error: ApolloError | undefined;
  isLoading: boolean;
};

const QUERY = gql`
  query GetOrder($orderId: ID!) {
    getOrder(orderId: $orderId) {
      id
      kamiounId
      storeId
      state
      status
      total
      createdAt
      customerId
      customerFirstname
      customerLastname
      deliveryAgentId
      deliveryAgent
      deliveryDate
      deliveryStatus
      source
      items {
        id
        orderId
        productId
        productName
        quantity
        productPrice
        totalPrice
        sku
        shipped
        pcb
      }
    }
  }
`;

export const useGetOrder = (orderId: string) => {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      orderId,
    },
  });

  return {
    data: data?.getOrder,
    isLoading: loading,
    error,
    refetch,
  };
};
