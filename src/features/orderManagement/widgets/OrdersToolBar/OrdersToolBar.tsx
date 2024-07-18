// import Loading from "@/components/elements/Loading";
// import Dropdown from "@/components/inputs/Dropdown";
// import SearchBar from "@/components/inputs/SearchBar";
// import { useState } from "react";

// import MultipleOrdersActionsDropdown from "../MultipleOrdersActionsDropdown";

// //import ActionsDropdown from "@/components/pages/OrderDetailsPage/OrderActionsDropdown";

// const sortOptions = [
//   { name: "Newest", key: "createdAt:desc" },
//   { name: "Oldest", key: "createdAt:asc" },
//   { name: "Earliest Delivery Date", key: "deliveryDate:asc" },
//   { name: "Latest Delivery Date", key: "deliveryDate:desc" },
//   { name: "Highest Total", key: "total:desc" },
//   { name: "Lowest Total", key: "total:asc" },
//   { name: "Customers (A-Z)", key: "customerFirstname:asc" },
//   { name: "Customers (Z-A)", key: "customerFirstname:desc" },
// ];

// const OrdersToolBar = ({
//   onSearch,
//   onSort,
//   selectedStatus,
//   searchRef,
//   sortRef,
//   isSomeOrdersSelected,
//   actions,
//   isPending,
//   actionsRef,
// }: any) => {
//   return (
//     <div className="mt-48 flex flex-grow flex-wrap items-center justify-between gap-3   px-4 bg-green-600 h-96">
//       <div className="flex items-center justify-center">
//         <p className="m-4 text-xl font-bold capitalize ">{`${selectedStatus} Orders `}</p>
//         <div className="h-96 w-full bg-red-600" />
//         {/* {isSomeOrdersSelected && (
//           <MultipleOrdersActionsDropdown
//             actions={actions}
//             isPending={isPending}
//             dropRef={actionsRef}
//           />
//         )} */}
//       </div>

//       <div className="flex items-center justify-center gap-4 lg:gap-8 xl:gap-10">
//         <SearchBar ref={searchRef} onSearch={onSearch} isWithInstantSearch />
//         <div className="flex items-center  justify-center">
//           <p className="whitespace-nowrap font-bold">Sort By : </p>
//           <Dropdown
//             onSelectedChange={onSort}
//             items={sortOptions}
//             ref={sortRef}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrdersToolBar;

import Loading from "@/features/shared/elements/Loading";
import Dropdown from "@/features/shared/inputs/Dropdown";
import SearchBar from "@/features/shared/inputs/SearchBar";
import { useState } from "react";
import ActionsDropdown from "../OrderActionsDropdown";

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
  actionsRef,
}: any) => {
  return (
    <div className=" flex flex-grow flex-wrap items-center justify-between gap-3  bg-n0 px-4">
      <div className="flex items-center justify-center">
        <p className="m-4 text-xl font-bold capitalize ">{`${selectedStatus} Orders `}</p>
        {isSomeOrdersSelected && (
          <ActionsDropdown
            actions={actions}
            isPending={isPending}
            dropRef={actionsRef}
          />
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
