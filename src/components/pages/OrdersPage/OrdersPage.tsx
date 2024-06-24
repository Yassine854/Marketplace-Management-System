import AnyMatchingResults from "@/components/elements/TablesElements/AnyMatchingResults";
import Box from "@/components/layouts/Box";
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
    <div className="flex h-full w-full flex-grow flex-col justify-between bg-blue-500">
      <div className=" mt-[4.6rem]  flex h-28  w-full items-center justify-center bg-violet-400 px-4  ">
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

      <div className=" flex h-20 w-full items-center justify-center bg-violet-400 px-4 ">
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
