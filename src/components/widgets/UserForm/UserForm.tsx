import Dropdown from "../../elements/sharedElements/Dropdown";

const CreateUserForm = () => {
  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6">
      <form className=" w-full lg:col-span-7 xl:col-span-8">
        <div className="box w-full xl:p-8">
          <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
            <p className="text-xl font-bold">Create User</p>
          </div>
          <div className="box mb-6 grid  grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="name"
                className="mb-4 block font-medium md:text-lg"
              >
                Username
              </label>
              <input
                type="text"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter Name"
                id="name"
                required
              />
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
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="email"
                className="mb-4 block font-medium md:text-lg"
              >
                First Name
              </label>
              <input
                type="email"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter Email"
                id="email"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="email"
                className="mb-4 block font-medium md:text-lg"
              >
                Last Name
              </label>
              <input
                type="email"
                className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                placeholder="Enter Email"
                id="email"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="experience"
                className="mb-4 block font-medium md:text-lg"
              >
                Role
              </label>
              <Dropdown
                items={[]}

                // items={experiences}
                // setSelected={setExperience}
                // selected={experience}
                // width="w-full !py-3 "
                // bg=" bg-n0 dark:bg-bg4"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="experience"
                className="mb-4 block font-medium md:text-lg"
              >
                Warehouse
              </label>
              <Dropdown
                items={[]}

                // items={experiences}
                // setSelected={setExperience}
                // selected={experience}
                // width="w-full !py-3 "
                // bg=" bg-n0 dark:bg-bg4"
              />
            </div>
          </div>

          <div className="mt-6">
            {/* <CheckboxCustom label="This record is private" /> */}
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
