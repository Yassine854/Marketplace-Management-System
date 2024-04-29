"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/elements/sharedElements/Dropdown";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import SearchBar from "@/components/elements/TablesElements/SearchBar";
import { useRouter } from "next/navigation";

const actions = [
  { name: "Generate Pick List", key: "picklist" },
  { name: "Print BL's", key: "bl" },
  { name: "Manage Milk-Runs", key: "milk-run" },
];
const OrdersTableHeader = ({
  title,
  sortOptions,
  sortBy,
  setSortBy,
  setSearch,
  selectedOrders,
}: any) => {
  const { push } = useRouter();
  const [selected, setSelected] = useState({ name: "Actions", key: "a" });

  useEffect(() => {
    setSelected({ name: "Actions", key: "a" });
  }, [selectedOrders]);

  return (
    <>
      <div className="flex  w-full  flex-grow       bg-n10">
        <div className="m-2 flex h-12 w-36 items-center justify-start ">
          <IconArrowNarrowLeft size={64} />
        </div>
        <div className=" m-2 flex h-12  w-full items-center  justify-center  ">
          <p className="text-3xl font-bold">Order 34534 Details : </p>
        </div>
      </div>
      <div className="bt-dashed flex  h-16 w-full flex-grow  items-center  justify-between  bg-n10   ">
        <div className="m-4 flex h-16 flex-grow items-center justify-center  ">
          <p className="text-xl font-bold">Customer : Mohamed Jrad</p>
        </div>
        <div className="m-4 flex h-16 flex-grow items-center justify-center ">
          <p className="text-xl font-bold">Delivery Date : 05/05/2024</p>
        </div>
        <div className="m-4 flex h-16 flex-grow items-center justify-center ">
          <p className="text-xl font-bold">Total : 3420</p>
        </div>
        <div className="m-4 flex h-16 w-32  items-center justify-center ">
          <button className="btn ">Edit</button>
        </div>
      </div>
    </>
  );
};

export default OrdersTableHeader;
