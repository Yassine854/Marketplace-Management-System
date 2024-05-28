import Box from "@/components/layouts/Box";
import CreateUserForm from "@/components/forms/CreateUserForm";
import { useGetUsers } from "@/hooks/queries/useGetUsers";

const UserPage = () => {
  const { users, isLoading } = useGetUsers();

  return (
    <Box>
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <CreateUserForm />
      </div>
    </Box>
  );
};

export default UserPage;
