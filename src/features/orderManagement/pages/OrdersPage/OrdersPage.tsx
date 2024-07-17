// import { useOrdersPage } from "./useOrdersPage";
// import OrdersTable from "@/features/orderManagement/tables/OrdersTable";
// import Divider from "@/components/elements/SidebarElements/Divider";
// import Pagination from "@/features/orderManagement/widgets/Pagination";
// import OrdersToolBar from "@/features/orderManagement/widgets/OrdersToolBar";
// import AnyMatchingResults from "@/features/orderManagement/widgets/AnyMatchingResults";
// import OrderCancelingModal from "@/components/widgets/OrderCancelingModal/OrderCancelingModal";

// const OrdersPage = () => {
//   const {
//     orders,
//     status,
//     sortRef,
//     setSort,
//     actions,
//     searchRef,
//     setSearch,
//     isPending,
//     actionsRef,
//     totalOrders,
//     paginationRef,
//     setCurrentPage,
//     setItemsPerPage,
//     isSomeOrdersSelected,
//   } = useOrdersPage();

//   return (
//     <div className="flex h-full w-full flex-grow flex-col justify-between ">
//       <div className=" mt-[4.3rem]  flex  w-full items-center justify-center border-t-4  ">
//         <OrdersToolBar
//           onSort={setSort}
//           sortRef={sortRef}
//           actions={actions}
//           onSearch={setSearch}
//           searchRef={searchRef}
//           isPending={isPending}
//           actionsRef={actionsRef}
//           selectedStatus={status}
//           isSomeOrdersSelected={isSomeOrdersSelected}
//         />
//       </div>
//       <Divider />
//       <div className="relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3 pb-24">
//         <OrdersTable />
//         {orders?.length == 0 && <AnyMatchingResults />}
//       </div>
//       <Divider />
//       <div className=" flex  w-full items-center justify-center bg-n0 ">
//         {orders?.length !== 0 && (
//           <Pagination
//             ref={paginationRef}
//             selectedStatus={status}
//             totalItems={totalOrders}
//             onPageChanged={setCurrentPage}
//             onItemsPerPageChanged={setItemsPerPage}
//           />
//         )}
//       </div>
//       <OrderCancelingModal />
//     </div>
//   );
// };

// export default OrdersPage;

import Divider from "@/components/elements/SidebarElements/Divider";
import AnyMatchingResults from "../../widgets/AnyMatchingResults";
import OrdersTable from "../../tables/OrdersTable";
import OrdersToolBar from "../../widgets/OrdersToolBar";
import Pagination from "../../widgets/Pagination";
import OrderCancelingModal from "../../widgets/OrderCancelingModal/OrderCancelingModal";
import { useOrdersPage } from "./useOrdersPage";

const OrdersPage = () => {
  const {
    sortRef,
    setSort,
    onOpenChange,
    cancelOrders,
    paginationRef,
    setCurrentPage,
    setItemsPerPage,
    searchRef,
    setSearch,
    // isCancelingModalOpen,
    isSomeOrdersSelected,
    orders,
    totalOrders,
    status,
    actions,
    isPending,
    // isCancelingPending,
    onClose,
    actionsRef,
  } = useOrdersPage();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[14.8rem]  flex  w-full items-center justify-center border-t-4  ">
        <OrdersToolBar
          actionsRef={actionsRef}
          searchRef={searchRef}
          onSearch={setSearch}
          onSort={setSort}
          selectedStatus={status}
          sortRef={sortRef}
          selectedOrders
          isSomeOrdersSelected={isSomeOrdersSelected}
          actions={actions}
          isPending={isPending}
        />
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3 pb-24">
        <OrdersTable />
        {orders?.length == 0 && <AnyMatchingResults />}
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        {orders?.length !== 0 && (
          <Pagination
            ref={paginationRef}
            selectedStatus={status}
            totalItems={totalOrders}
            onItemsPerPageChanged={setItemsPerPage}
            onPageChanged={setCurrentPage}
          />
        )}
      </div>
      <OrderCancelingModal
      // onConfirm={cancelOrders}
      // message={" Are you sure you want to cancel those orders ? "}
      // isOpen={isCancelingModalOpen}
      // onOpenChange={onOpenChange}
      // isPending={isCancelingPending}
      // onClose={onClose}
      />
    </div>
  );
};

export default OrdersPage;
