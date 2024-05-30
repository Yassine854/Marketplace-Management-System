import Box from "@/components/layouts/Box";
import UsersTable from "@/components/tables/UsersTable";
import UsersTableHeader from "@/components/widgets/UsersTableHeader";
import { useGetUsers } from "@/hooks/queries/useGetUsers";
import { useNavigation } from "@/hooks/useNavigation";

const UsersPage = () => {
  const { users, isLoading } = useGetUsers();
  const { navigateToCreateUserForm } = useNavigation();

  return (
    <Box>
      <UsersTableHeader onButtonClick={navigateToCreateUserForm} />
      <div className=" flex  w-full flex-grow flex-col overflow-y-scroll bg-n10 pb-24">
        <UsersTable users={users} isLoading={isLoading} />
      </div>
    </Box>
  );
};

export default UsersPage;
