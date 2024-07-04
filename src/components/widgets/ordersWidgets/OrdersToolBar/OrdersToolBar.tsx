import Loading from "@/components/elements/Loading";
import Dropdown from "@/components/inputs/Dropdown";
import SearchBar from "@/components/inputs/SearchBar";
import { useState } from "react";

const sortOptions = [
  { name: "Newest", key: "createdAt:desc" },
  { name: "Oldest", key: "createdAt:asc" },
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
  searchRef,
  sortRef,
  isSomeOrdersSelected,
  actions,
  isPending,
}: any) => {
  const [selectedAction, setSelectedAction] = useState("");

  return (
    <div className=" flex flex-grow flex-wrap items-center justify-between gap-3  bg-n0 px-4">
      <div className="flex items-center justify-center">
        <p className="m-4 text-xl font-bold capitalize ">{`${selectedStatus} Orders `}</p>
        {isSomeOrdersSelected && (
          <>
            <Dropdown items={actions} onSelectedChange={setSelectedAction} />
            {selectedAction && (
              <>
                {!isPending && (
                  <button
                    className="btn m-2 flex h-2 items-center  justify-center p-4"
                    onClick={() => {
                      const selected = actions.find(
                        (action: any) => action.key === selectedAction,
                      );
                      selected.action();
                    }}
                  >
                    Confirm
                  </button>
                )}
                {isPending && (
                  <div className="ml-4 h-8 w-8 ">
                    <Loading />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar ref={searchRef} onSearch={onSearch} isWithInstantSearch />
        <div className="flex items-center  justify-center">
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
