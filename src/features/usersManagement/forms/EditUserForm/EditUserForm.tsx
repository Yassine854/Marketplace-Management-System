import GoBackArrow from "../../widgets/GoBackArrow";
import RoleSelector from "../../widgets/RoleSelector";
import Loading from "@/features/shared/elements/Loading";
import TextInput from "@/features/shared/inputs/TextInput";
import { useCreateUserForm } from "../../hooks/useCreateUserForm";
import PasswordInput from "@/features/shared/inputs/PasswordInput";
import { useNavigation } from "@/features/shared/hooks/useNavigation";

const EditUserForm = () => {
  const { navigateToUsersTable, navigateBack } = useNavigation();

  const { handleSubmit, register, setValue, errors, isLoading } =
    useCreateUserForm();

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      <form
        className="w-full lg:col-span-7 xl:col-span-8"
        onSubmit={handleSubmit}
      >
        <div className="box w-full min-w-[800px]  xl:p-8">
          <div className="bb-dashed mb-6 flex items-center  pb-6">
            <GoBackArrow onClick={navigateBack} />
            <p className="ml-4 text-xl font-bold">Create User</p>
          </div>
          <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
            {/* <TextInput
              label="Username * "
              isError={errors.username}
              placeholder="Enter username"
              register={register("username")}
              errorMessage={errors.username?.message}
            /> */}
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
              label="Password *"
              isError={errors.password}
              register={register("password")}
              errorMessage={errors.password?.message}
            />
            <PasswordInput
              label="Confirm Password *"
              isError={errors.confirmPassword}
              register={register("confirmPassword")}
              errorMessage={errors.confirmPassword?.message}
            />
          </div>

          <div className="mt-6">
            <div className="mt-7 flex gap-4 lg:mt-10">
              {!isLoading && (
                <button type="submit" className="btn px-4 hover:shadow-none">
                  Create
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
