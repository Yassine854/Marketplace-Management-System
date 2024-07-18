// import Dropdown from "../../inputs/Dropdown";
import Loading from "@/components/elements/Loading";
import PasswordInput from "@/components/inputs/PasswordInput";
import TextInput from "@/components/inputs/TextInput";
//import { useCreateUserForm } from "../../hooks/useCreateUserForm";
import { useNavigation } from "@/hooks/useNavigation";

const CreateUserForm = () => {
  // const {
  //   handleSubmit,
  //   register,
  //   setValue,
  //   errors,
  //   setSelectedRole,
  //   warehouseRef,
  //   warehouses,
  //   roles,
  //   isLoading,
  // } = useCreateUserForm();
  const { navigateToUsersTable } = useNavigation();

  const isLoading = false;

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      <form
        className="w-full lg:col-span-7 xl:col-span-8"
        //  onSubmit={handleSubmit}
      >
        <div className="box w-full min-w-[800px]  xl:p-8">
          <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
            <p className="text-xl font-bold">Create User</p>
          </div>
          <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
            <TextInput
              label="Username * "
              placeholder="Enter username"
              // register={register("username")}
              // isError={errors.username}
              // errorMessage={errors.username?.message}
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              //  register={register("email")}
              //  isError={errors.email}
              // errorMessage={errors.email?.message}
            />
            <PasswordInput
              label="Password"
              // register={register("password")}
              //isError={errors.password}
              //errorMessage={errors.password?.message}
            />
            <PasswordInput
              label="Confirm Password"
              // register={register("confirmPassword")}
              // isError={errors.confirmPassword}
              // errorMessage={errors.confirmPassword?.message}
            />

            <TextInput
              label="First Name *"
              placeholder="Enter first name"
              // register={register("firstName")}
              // isError={errors.firstName}
              //  errorMessage={errors.firstName?.message}
            />
            <TextInput
              label="Last Name *"
              placeholder="Enter lastName"
              //register={register("lastName")}
              //  isError={errors.lastName}
              // errorMessage={errors.lastName?.message}
            />
            {/* <Dropdown
              items={roles}
              onSelectedChange={(selected) => {
                setValue("roleCode", selected);

                var result = roles.filter((obj: any) => {
                  return obj.key === selected;
                });

                setSelectedRole(result[0]);
              }}
            /> */}
            {/* <Dropdown
              //  label="Warehouse"
              ref={warehouseRef}
              items={warehouses}
              onSelectedChange={(selected) =>
                setValue("warehouseCode", selected)
              }
            /> */}
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

export default CreateUserForm;
