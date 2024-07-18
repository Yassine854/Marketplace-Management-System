import Pagination from "../../widgets/Pagination";
import OrdersTable from "../../tables/OrdersTable";
import OrdersToolBar from "../../widgets/OrdersToolBar";
import { useOrdersPage } from "../../hooks/useOrdersPage";
import AnyMatchingResults from "../../widgets/AnyMatchingResults";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import OrderCancelingModal from "../../widgets/OrderCancelingModal/OrderCancelingModal";

const OrdersPage = () => {
  const {
    orders,
    status,
    actions,
    sortRef,
    setSort,
    isPending,
    searchRef,
    setSearch,
    actionsRef,
    totalOrders,
    cancelOrders,
    paginationRef,
    setCurrentPage,
    setItemsPerPage,
    isCancelingPending,
    isSomeOrdersSelected,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useOrdersPage();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center border-t-4  ">
        <OrdersToolBar
          onSort={setSort}
          sortRef={sortRef}
          actions={actions}
          onSearch={setSearch}
          searchRef={searchRef}
          isPending={isPending}
          selectedStatus={status}
          actionsRef={actionsRef}
          isSomeOrdersSelected={isSomeOrdersSelected}
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
            onPageChanged={setCurrentPage}
            onItemsPerPageChanged={setItemsPerPage}
          />
        )}
      </div>
      <OrderCancelingModal
        onConfirm={cancelOrders}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onClose={onCancelingModalClose}
      />
    </div>
  );
};

export default OrdersPage;
