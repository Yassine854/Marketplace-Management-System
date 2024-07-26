import { gql, useQuery } from "@apollo/client";
import { useUsersStore } from "../../stores/usersStore";

const QUERY = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      user {
        id
        firstName
        lastName
        username
        password
        roleId
        createdAt
      }
      success
      message
    }
  }
`;

export const useGetUser = () => {
  const { userOnReviewUsername } = useUsersStore();
  const { data, loading, error, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    variables: {
      username: userOnReviewUsername,
    },
  });

  return {
    user: data?.getUser.user,
    isLoading: loading,
    error,
    refetch,
  };
};
