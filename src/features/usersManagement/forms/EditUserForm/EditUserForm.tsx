import GoBackArrow from "../../widgets/GoBackArrow";
import RoleSelector from "../../widgets/RoleSelector";
import Loading from "@/features/shared/elements/Loading";
import TextInput from "@/features/shared/inputs/TextInput";
import PasswordInput from "@/features/shared/inputs/PasswordInput";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useEditUserForm } from "../../hooks/useEditUserForm";

const EditUserForm = () => {
  const { navigateToUsersTable, navigateBack } = useNavigation();

  const { handleSubmit, register, setValue, errors, isLoading, user } =
    useEditUserForm();

  if (isLoading) {
    return <div>Loading... </div>;
  }
  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      <form
        className="w-full lg:col-span-7 xl:col-span-8"
        onSubmit={handleSubmit}
      >
        <div className="box w-full min-w-[800px]  xl:p-8">
          <div className="bb-dashed mb-6 flex items-center  pb-6">
            <GoBackArrow onClick={navigateBack} />
            <p className="ml-4 text-xl font-bold">Edit User</p>
          </div>
          <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
            <div className="">
              <p className="text-xl  font-medium">Username :</p>
              <p className="ml-4  mt-2 text-xl font-bold">{user?.username}</p>
            </div>
            <RoleSelector
              isError={errors.roleId}
              errorMessage={errors.roleId?.message}
              onChange={(roleId: string) => setValue("roleId", roleId)}
            />
            <TextInput
              label="First Name *"
              isError={errors.firstName}
              placeholder="Enter first name"
              register={register("firstName")}
              errorMessage={errors.firstName?.message}
            />
            <TextInput
              label="Last Name *"
              isError={errors.lastName}
              placeholder="Enter lastName"
              register={register("lastName")}
              errorMessage={errors.lastName?.message}
            />

            <PasswordInput
              label="New Password "
              isError={errors.password}
              register={register("password")}
              errorMessage={errors.password?.message}
            />
            <PasswordInput
              label="Confirm New Password "
              isError={errors.confirmPassword}
              register={register("confirmPassword")}
              errorMessage={errors.confirmPassword?.message}
            />
          </div>

          <div className="mt-6">
            <div className="mt-7 flex gap-4 lg:mt-10">
              {!isLoading && (
                <button type="submit" className="btn px-4 hover:shadow-none">
                  Edit
                </button>
              )}
              {isLoading && <Loading />}
              <button
                type="reset"
                className="btn-outline px-4 shadow-none"
                onClick={navigateToUsersTable}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
