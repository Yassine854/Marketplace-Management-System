import { gql, useQuery } from "@apollo/client";

import { ApolloError } from "@apollo/client";
import { Order } from "@/types/order";

export type Params = {
  page: number;
  perPage: number;
  sortBy: string;
  filterBy: string;
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
    $page: Int!
    $perPage: Int!
    $sortBy: String!
    $filterBy: String!
    $search: String!
  ) {
    getOrders(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      filterBy: $filterBy
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
  page,
  perPage,
  sortBy,
  filterBy,
  search,
}: Params): Res => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      filterBy,
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
