import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query GetUsers {
    getUsers {
      message
      success
      users {
        id
        username
        email

        role
        warehouses
      }
    }
  }
`;

export const useGetUsers = () => {
  const { data, loading, error } = useQuery(QUERY);

  return {
    data: data?.getUsers.users,
    isLoading: loading,
    error,
  };
};
