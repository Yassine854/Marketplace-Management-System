import Dropdown from "@/components/elements/sharedElements/Dropdown";
import SearchBar from "@/components/elements/sharedElements/SearchBar";
import { useState } from "react";

const actions = [
  { name: "Generate Pick List", key: "picklist" },
  { name: "Print BL's", key: "bl" },
  { name: "Manage Milk-Runs", key: "milk-run" },
];

const sortOptions = [
  { name: "Newest", key: "createdAt:asc" },
  { name: "Oldest", key: "createdAt:desc" },
  { name: "Earliest Delivery Date", key: "deliveryDate:asc" },
  { name: "Latest Delivery Date", key: "deliveryDate:desc" },
  { name: "Highest Total", key: "total:desc" },
  { name: "Lowest Total", key: "total:asc" },
  { name: "Customers (A-Z)", key: "customerFirstname:asc" },
  { name: "Customers (Z-A)", key: "customerFirstname:desc" },
];

const OrdersToolBar = ({
  onSearch,
  onSort,
  selectedStatus,
  selectedOrders = ["234", "234324"],
  searchRef,
  sortRef,
}: any) => {
  const [selectedAction, setSelectedAction] = useState("");

  return (
    <div className=" flex h-20 w-full flex-wrap items-center justify-between gap-3 bg-n10 p-2">
      <div className="flex items-center justify-center">
        <p className="m-4 text-xl font-bold capitalize ">{`${selectedStatus} Orders Table`}</p>
        {!!selectedOrders.length && (
          <>
            <Dropdown items={actions} onSelectedChange={setSelectedAction} />
            {selectedAction && (
              <button
                className="btn m-4 flex h-4 items-center  justify-center p-4"
                onClick={() => {}}
              >
                Confirm
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar ref={searchRef} onSearch={onSearch} isWithInstantSearch />
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap font-bold">Sort By : </p>
          <Dropdown
            onSelectedChange={onSort}
            items={sortOptions}
            ref={sortRef}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersToolBar;
