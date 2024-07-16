import { gql, useQuery } from "@apollo/client";

export type Params = {
  status: string;
  page: number;
  perPage: number;
};

const QUERY = gql`
  query GetOrders($status: String!, $page: Int!, $perPage: Int!) {
    getOrders(status: $status, page: $page, perPage: $perPage) {
      orders {
        id
        deliveryDate
        customer {
          id
          name
        }
      }
      total
    }
  }
`;

export const useGetOrders = ({ status, page, perPage }: Params) => {
  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: "no-cache",

    variables: {
      status,
      page,
      perPage,
    },
  });

  return { data: data?.getOrders, isLoading: loading, error };
};
