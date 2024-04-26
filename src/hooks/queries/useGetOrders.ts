import { gql, useQuery } from "@apollo/client";

import { ApolloError } from "@apollo/client";
import { Order } from "@/types/order";

export type Params = {
  status: string;
  page: number;
  perPage: number;
};

type Orders = {
  orders: Order[];
  total: number;
};

type Res = {
  data: Orders;
  error: ApolloError | undefined;
  isLoading: boolean;
};

const QUERY = gql`
  query GetOrders($status: String!, $page: Int!, $perPage: Int!) {
    getOrders(status: $status, page: $page, perPage: $perPage) {
      orders {
        id
        deliveryDate
        total
        customer {
          id
          name
        }
      }
      totalOrders
    }
  }
`;

export const useGetOrders = ({ status, page, perPage }: Params) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      status,
      page,
      perPage,
    },
  });

  return {
    data: data?.getOrders,
    isLoading: loading,
    error,
  };
};
