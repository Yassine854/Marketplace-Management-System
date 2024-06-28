import Box from "@/components/layouts/Box";
import CreateUserForm from "@/components/forms/CreateUserForm";

const UserPage = () => {
  return (
    <div>
      <div className="mt-36 h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <CreateUserForm />
      </div>
    </div>
  );
};

export default UserPage;
