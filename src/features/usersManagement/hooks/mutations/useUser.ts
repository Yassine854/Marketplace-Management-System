import { useCreateUser } from "./useCrateUser";

export const useUser = () => {
  const { create, isLoading, data, error } = useCreateUser();

  const user = {
    mutation: {
      create: {
        data,
        error,
        isLoading,
        newUser: create,
      },
    },
  };

  return user;
};
