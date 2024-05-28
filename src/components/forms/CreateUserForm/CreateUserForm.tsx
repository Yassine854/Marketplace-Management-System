import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

import Dropdown from "../../inputs/Dropdown";
import { FormSchema } from "./formSchema";
import TextInput from "@/components/inputs/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof FormSchema>;

const roles = [
  { name: "Agent", key: "AGENT" },
  { name: "Admin", key: "ADMIN" },
];

const CreateUserForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "agent",
      warehouses: [""],
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("🚀 ~ const onSubmit:SubmitHandler<FormData>= ~ data:", data);
  };

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6">
      <form
        className="w-full lg:col-span-7 xl:col-span-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="box w-full xl:p-8">
          <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
            <p className="text-xl font-bold">Create User</p>
          </div>
          <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
            <TextInput
              label="Username * "
              placeholder="Enter username"
              register={register("username")}
              isError={errors.username}
              errorMessage={errors.username?.message}
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              register={register("email")}
              isError={errors.email}
              errorMessage={errors.email?.message}
            />
            <TextInput
              label="First Name *"
              placeholder="Enter first name"
              register={register("firstName")}
              isError={errors.firstName}
              errorMessage={errors.firstName?.message}
            />
            <TextInput
              label="Last Name *"
              placeholder="Enter lastName"
              register={register("lastName")}
              isError={errors.lastName}
              errorMessage={errors.lastName?.message}
            />

            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="role"
                className="mb-4 block font-medium md:text-lg"
              >
                Role
              </label>
              <Dropdown
                items={roles}
                // Provide items, setSelected, selected props as needed
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="warehouses"
                className="mb-4 block font-medium md:text-lg"
              >
                Warehouses
              </label>
              <Dropdown
                items={[]}
                // Provide items, setSelected, selected props as needed
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mt-7 flex gap-4 lg:mt-10">
              <button type="submit" className="btn px-4 hover:shadow-none">
                Create
              </button>
              <button type="reset" className="btn-outline px-4 shadow-none">
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
