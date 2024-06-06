import { useCreateUser } from "./mutations/useCrateUser";

export const useUser = () => {
  const { create, isLoading, data, error } = useCreateUser();

  const user = {
    mutation: {
      create: {
        newUser: create,
        isLoading,
        data,
        error,
      },
    },
  };

  return user;
};
