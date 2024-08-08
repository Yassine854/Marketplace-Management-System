// import { gql, useQuery } from "@apollo/client";

// const QUERY = gql`
//   query GetUsers {
//     getUsers {
//       message
//       success
//       users {
//         id
//         username
//         firstName
//         lastName
//         roleId
//         createdAt
//       }
//     }
//   }
// `;

// export const useGetUsers = () => {
//   const { data, loading, error, refetch } = useQuery(QUERY, {
//     fetchPolicy: "network-only",
//   });

//   return {
//     users: data?.getUsers.users,
//     isLoading: loading,
//     error,
//     refetch,
//   };
// };

import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  const {
    isLoading,
    data: users,
    refetch,
  } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const { data } = await axios.servicesClient(`/api/users/getAllUsers`);
      return data;
    },
  });

  return {
    users,
    refetch,
    isLoading,
  };
};
