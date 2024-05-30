import { gql, useMutation } from "@apollo/client";

const MUTATION = gql`
  mutation CreateUser($input: CreateUserInput) {
    createUser(input: $input) {
      message
      success
    }
  }
`;

interface CreateUserInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleCode: string;
  warehouseCode: string;
}

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
      process.env.NODE_ENV === "development" && console.error(err);

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
