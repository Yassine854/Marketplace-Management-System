import UsersTable from "@/components/tables/UsersTable";
import UsersTableHeader from "@/components/widgets/UsersTableHeader";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useNavigation } from "@/hooks/useNavigation";

const UsersPage = () => {
  const { users, isLoading } = useGetUsers();
  const { navigateToCreateUserForm } = useNavigation();

  return (
    <div className=" mt-24 flex flex-grow flex-col">
      <UsersTableHeader onButtonClick={navigateToCreateUserForm} />
      <div className=" flex  w-full flex-grow flex-col overflow-y-scroll bg-n10">
        <UsersTable users={users} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default UsersPage;
