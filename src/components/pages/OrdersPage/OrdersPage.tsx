import Divider from "@/components/elements/SidebarElements/Divider";
import AnyMatchingResults from "@/components/widgets/ordersWidgets/AnyMatchingResults";
import OrdersTable from "@/components/tables/OrdersTable";
import OrdersToolBar from "@/components/widgets/ordersWidgets/OrdersToolBar";
import Pagination from "@/components/widgets/ordersWidgets/Pagination";
import OrderCancelingModal from "@/components/widgets/OrderCancelingModal";
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
    isCancelingModalOpen,
    isSomeOrdersSelected,
    orders,
    totalOrders,
    status,
    actions,
    isPending,
    isCancelingPending,
    onClose,
    actionsRef,
  } = useOrdersPage();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center border-t-4  ">
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
        onConfirm={cancelOrders}
        message={" Are you sure you want to cancel those orders ? "}
        isOpen={isCancelingModalOpen}
        onOpenChange={onOpenChange}
        isPending={isCancelingPending}
        onClose={onClose}
      />
    </div>
  );
};

export default OrdersPage;
