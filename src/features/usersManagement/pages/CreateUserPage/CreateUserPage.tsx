import Box from "@/components/layouts/Box";
import CreateUserForm from "../../forms/CreateUserForm";

const UserPage = () => {
  return (
    <div className="flex h-full flex-grow ">
      <div className=" h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <CreateUserForm />
      </div>
    </div>
  );
};

export default UserPage;
