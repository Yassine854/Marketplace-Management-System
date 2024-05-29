import Box from "@/components/layouts/Box";
import CreateUserForm from "@/components/forms/CreateUserForm";
import { useCreateUser } from "@/hooks/mutations/useCrateUser";
import { useGetUsers } from "@/hooks/queries/useGetUsers";

const UserPage = () => {
  // const { createUser, isLoading, error } = useCreateUser();

  return (
    <Box>
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <CreateUserForm
        // createUser={createUser}
        // isLoading={isLoading}
        // error={error}
        />
      </div>
    </Box>
  );
};

export default UserPage;
