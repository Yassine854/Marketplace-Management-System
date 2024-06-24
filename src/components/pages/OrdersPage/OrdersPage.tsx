import Divider from "@/components/elements/SidebarElements/Divider";
import AnyMatchingResults from "@/components/elements/TablesElements/AnyMatchingResults";
import OrdersTable from "@/components/tables/OrdersTable2";
import OrdersToolBar from "@/components/widgets/OrdersWidgets/OrdersToolBar";
import Pagination from "@/components/widgets/OrdersWidgets/Pagination";
import { useOrders } from "@/hooks/useOrders";
import { useStatusStore } from "@/stores/statusStore";

const OrdersPage = () => {
  const { status } = useStatusStore();

  const {
    orders,
    totalOrders,
    isLoading,
    setItemsPerPage,
    setCurrentPage,
    onSearch,
    onSort,
    changeSelectedSort,
    refs,

    onOrderClick,
    onSelectAllClick,
    onSelectOrderClick,
    isAllOrdersSelected,
    isSomeOrdersSelected,
  } = useOrders();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center border-t-4  ">
        <OrdersToolBar
          searchRef={refs.searchRef}
          onSearch={onSearch}
          onSort={onSort}
          selectedStatus={status}
          sortRef={refs.sortRef}
          selectedOrders
          isSomeOrdersSelected={isSomeOrdersSelected}
        />
      </div>
      <Divider />

      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3 pb-24">
        <OrdersTable
          isLoading={isLoading}
          orders={orders}
          onSort={onSort}
          changeSelectedSort={changeSelectedSort}
          onOrderClick={onOrderClick}
          onSelectAllClick={onSelectAllClick}
          onSelectOrderClick={onSelectOrderClick}
          isAllOrdersSelected={isAllOrdersSelected}
        />
        {orders?.length == 0 && <AnyMatchingResults />}
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        {orders?.length !== 0 && (
          <Pagination
            ref={refs.paginationRef}
            selectedStatus={status}
            totalItems={totalOrders}
            onItemsPerPageChanged={setItemsPerPage}
            onPageChanged={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
