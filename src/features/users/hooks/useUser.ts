import { useCreateUser } from "./mutations/useCrateUser";
import { useGetUser } from "./queries/useGetUser";

export const useUser = () => {
  const { create, isLoading, data, error } = useCreateUser();
  const { user: userDate } = useGetUser();
  const user = {
    mutation: {
      create: {
        data,
        error,
        isLoading,
        newUser: create,
      },
    },
    queries: {
      getUser: userDate,
    },
  };

  return user;
};
