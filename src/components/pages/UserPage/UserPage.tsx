import Box from "@/components/Layouts/Box";
import UserForm from "@/components/widgets/UserForm";
import { useGetUsers } from "@/hooks/queries/useGetUsers";

const UserPage = () => {
  const { users, isLoading } = useGetUsers();

  return (
    <Box>
      {/* <div className=" flex  h-full w-full items-center justify-center bg-fuchsia-700"> */}
      <UserForm />
      {/* </div> */}
    </Box>
  );
};

export default UserPage;
