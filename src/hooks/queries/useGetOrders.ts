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
  data: Orders;
  error: ApolloError | undefined;
  isLoading: boolean;
};

const QUERY = gql`
  query GetOrders(
    $status: String!
    $page: Int!
    $perPage: Int!
    $sortBy: String!
    $search: String!
  ) {
    getOrders(
      status: $status
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      search: $search
    ) {
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

export const useGetOrders = ({
  status,
  page,
  perPage,
  sortBy,
  search,
}: Params) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      status,
      page,
      perPage,
      sortBy,
      search,
    },
  });

  return {
    data: data?.getOrders,
    isLoading: loading,
    error,
  };
};
