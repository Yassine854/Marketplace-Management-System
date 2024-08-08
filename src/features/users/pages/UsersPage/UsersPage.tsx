import UsersTable from "../../tables/UsersTable";
import UsersTableHeader from "@/features/users/widgets/UsersTableHeader";
import { useGetAllUsers } from "@/features/users/hooks/queries/useGetAllUsers";
import { useNavigation } from "@/features/shared/hooks/useNavigation";

const UsersPage = () => {
  const { users, isLoading } = useGetAllUsers();
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
