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
        roleId
        createdAt
      }
    }
  }
`;

export const useGetUsers = () => {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
  });

  return {
    users: data?.getUsers.users,
    isLoading: loading,
    error,
    refetch,
  };
};
