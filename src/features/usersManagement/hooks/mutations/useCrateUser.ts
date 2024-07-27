import { gql, useMutation } from "@apollo/client";
import { logError } from "@/utils/logError";

const MUTATION = gql`
  mutation CreateUser($input: CreateUserInput) {
    createUser(input: $input) {
      message
      success
    }
  }
`;

type CreateUserInput = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
};

export const useCreateUser = () => {
  const [mutate, { data, loading, error }] = useMutation(MUTATION);

  const create = async (user: CreateUserInput) => {
    try {
      await mutate({
        variables: { input: user },
      });

      return {
        success: true,
        message: "User Created Successfully !",
      };
    } catch (err) {
      logError(err);

      return {
        success: false,
        //@ts-ignore
        message: err?.message ?? "User Created Successfully !",
      };
    }
  };

  return {
    create,
    data: data?.createUser,
    isLoading: loading,
    error,
  };
};
