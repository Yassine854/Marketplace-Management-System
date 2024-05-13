"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/elements/sharedElements/Dropdown";
import { Props } from "./OrdersTableHeader.types";
import SearchBar from "@/components/elements/sharedElements/SearchBar";
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
    <div className=" flex h-20 w-full flex-wrap items-center justify-between gap-3 bg-n10 p-2">
      <div className="flex items-center justify-center">
        <p className="m-4 text-xl font-bold capitalize ">{title}</p>
        {!!selectedOrders.length && (
          <>
            <Dropdown
              items={actions}
              selected={selected}
              setSelected={setSelected}
            />
            {selected.name !== "Actions" && (
              <button
                className="btn m-4 flex h-4 items-center  justify-center p-4"
                onClick={() => {
                  if (selected?.key == "milk-run") {
                    push("/milk-run");
                  }
                  setSelected({ name: "Actions", key: "a" });
                }}
              >
                Confirm
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar
          //@ts-ignore

          handleSearch={setSearch}
        />
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap">Sort By : </p>
          <Dropdown
            selected={sortBy}
            setSelected={setSortBy}
            items={sortOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersTableHeader;
