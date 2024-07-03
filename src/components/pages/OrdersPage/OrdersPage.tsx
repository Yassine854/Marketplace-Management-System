import Divider from "@/components/elements/SidebarElements/Divider";
import AnyMatchingResults from "@/components/elements/TablesElements/AnyMatchingResults";
import OrdersTable from "@/components/tables/OrdersTable";
import OrdersToolBar from "@/components/widgets/OrdersWidgets/OrdersToolBar";
import Pagination from "@/components/widgets/OrdersWidgets/Pagination";
import { useOrdersStore } from "@/stores/ordersStore";
import {
  useOrdersData,
  useOrdersSearch,
  useOrdersSelection,
  useOrdersSorting,
  useMultipleOrdersActions,
  useOrdersTablePagination,
} from "@/hooks/ordersHooks";
import OrderCancelingModal from "@/components/widgets/OrderCancelingModal";

const OrdersPage = () => {
  const { setSort, sortRef } = useOrdersSorting();
  const { searchRef, setSearch } = useOrdersSearch();
  const { isSomeOrdersSelected } = useOrdersSelection();
  const { orders, totalOrders } = useOrdersData();
  const { status } = useOrdersStore();
  const {
    actions,
    isPending,
    isCancelingModalOpen,
    onOpenChange,
    onClose,
    isCancelingPending,
    cancelOrders,
  } = useMultipleOrdersActions();
  const { paginationRef, setCurrentPage, setItemsPerPage } =
    useOrdersTablePagination();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center border-t-4  ">
        <OrdersToolBar
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
