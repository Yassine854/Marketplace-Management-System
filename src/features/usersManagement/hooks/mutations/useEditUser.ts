import { gql, useMutation } from "@apollo/client";
import { logError } from "@/utils/logError";

const MUTATION = gql`
  mutation EditUser(
    $username: String!
    $firstName: String!
    $lastName: String!
    $roleId: String!
    $newPassword: String!
  ) {
    editUser(
      username: $username
      firstName: $firstName
      lastName: $lastName
      roleId: $roleId
      newPassword: $newPassword
    ) {
      user {
        id
      }
      success
      message
    }
  }
`;

export const useEditUser = () => {
  const [mutate, { data, loading, error }] = useMutation(MUTATION);

  const edit = async (user: any) => {
    const { username, firstName, lastName, password, roleId } = user;
    try {
      await mutate({
        variables: {
          username,
          firstName,
          lastName,
          newPassword: password,
          roleId,
        },
      });

      return {
        success: true,
        message: "User Updated Successfully !",
      };
    } catch (err) {
      logError(err);

      return {
        success: false,
        //@ts-ignore
        message: err?.message ?? "User Updated Successfully !",
      };
    }
  };

  return {
    edit,
    data: data?.editUser,
    isLoading: loading,
    error,
  };
};
