import Box from "@/components/layouts/Box";
import UsersTable from "@/components/tables/UsersTable";
import UsersTableHeader from "@/components/widgets/UsersTableHeader";
import { useGetUsers } from "@/hooks/queries/useGetUsers";

const UsersPage = () => {
  const { users, isLoading } = useGetUsers();

  return (
    <Box>
      <UsersTableHeader />
      <div className=" flex  w-full flex-grow flex-col overflow-y-scroll bg-n10 pb-24">
        <UsersTable users={users} isLoading={isLoading} />
      </div>
    </Box>
  );
};

export default UsersPage;
