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
        roleId
        warehouseId
      }
    }
  }
`;

export const useGetUsers = () => {
  const { data, loading, error } = useQuery(QUERY);

  return {
    users: data?.getUsers.users,
    isLoading: loading,
    error,
  };
};
