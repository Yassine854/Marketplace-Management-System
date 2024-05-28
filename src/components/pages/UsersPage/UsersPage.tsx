import Box from "@/components/Layouts/Box";
import UsersTable from "@/components/widgets/UsersTable";
import UsersTableHeader from "@/components/widgets/UsersTableHeader";

const UsersPage = () => {
  return (
    <Box>
      <UsersTableHeader />
      <div className=" flex  w-full flex-grow flex-col overflow-y-scroll bg-n10 pb-24">
        <UsersTable />
      </div>
    </Box>
  );
};

export default UsersPage;
