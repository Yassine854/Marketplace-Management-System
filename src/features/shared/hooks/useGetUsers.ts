import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query GetUsers {
    getUsers {
      message
      success
      users {
        id
        username
        firstName
        lastName
        email
        status
        roleCode
        warehouseCode
        createdAt
      }
    }
  }
`;

export const useGetUsers = () => {
  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: "network-only",
  });

  return {
    users: data?.getUsers.users,
    isLoading: loading,
    error,
  };
};
