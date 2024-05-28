import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

import Dropdown from "../../elements/sharedElements/Dropdown";
import { FormSchema } from "./formSchema";
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
    getValues,
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
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="username"
                className="mb-4 block font-medium md:text-lg"
              >
                Username *
              </label>
              <input
                type="text"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter Username"
                id="username"
                {...register("username")}
              />
              {errors.username && (
                <p className="ml-4 mt-1 text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="email"
                className="mb-4 block font-medium md:text-lg"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter Email"
                id="email"
                {...register("email")}
              />
              {getValues("email") && errors.email && (
                <p className="ml-4 mt-1 text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="firstName"
                className="mb-4 block font-medium md:text-lg"
              >
                First Name *
              </label>
              <input
                type="text"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter First Name"
                id="firstName"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="ml-4 mt-1 text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="lastName"
                className="mb-4 block font-medium md:text-lg"
              >
                Last Name *
              </label>
              <input
                type="text"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter Last Name"
                id="lastName"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="ml-4 mt-1 text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
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
