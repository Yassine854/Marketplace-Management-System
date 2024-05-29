import { gql, useMutation } from "@apollo/client";

import { withErrorHandling } from "@/utils/withErrorHandling";

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
  roleId: string;
  warehouseId: string;
}

export const useCreateUser = () => {
  const [mutate, { data, loading, error }] = useMutation(MUTATION);

  const create = withErrorHandling(async (user: CreateUserInput) => {
    const res = await mutate({
      variables: { input: user },
    });

    return {
      success: res?.createUser.success,
      message: res?.createUser.message,
    };
  });

  return {
    create,
    data: data?.createUser,
    isLoading: loading,
    error,
  };
};
