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
      customer {
        id
      }
      total
      deliveryDate
      lines {
        id
        orderId
        productId
        productPrice
        productName
        quantity
        totalPrice
        sku
      }
    }
  }
`;

export const useGetOrder = ({ orderId }: { orderId: string }) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      orderId,
    },
  });

  return {
    data: data?.getOrder,
    isLoading: loading,
    error,
  };
};
