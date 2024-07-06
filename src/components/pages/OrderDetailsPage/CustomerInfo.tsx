import { IconUser } from "@tabler/icons-react";

const CustomerInfo = ({ firstname, lastname, phone }: any) => {
  return (
    <div className="  flex h-32 ">
      <div className="">
        <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
          <IconUser stroke={2} size={48} />
        </div>
      </div>

      <div className="ml-4  flex h-full w-full flex-grow flex-col  ">
        <p className=" pb-2 text-2xl font-bold text-black">Customer</p>
        <p className="text-black  ">
          <span className="text-n90 ">Name :</span>
          {firstname} {lastname}
        </p>
        <p className="text-black  ">
          <span className="text-n90 ">Phone :</span>
          {phone}
        </p>
      </div>
    </div>
  );
};

export default CustomerInfo;
