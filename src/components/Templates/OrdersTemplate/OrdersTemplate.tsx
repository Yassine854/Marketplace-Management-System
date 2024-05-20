import Box from "@/components/widgets/Box";
import OrdersTable from "@/components/widgets/OrdersWidgets/OrdersTable";
import OrdersToolBar from "@/components/widgets/OrdersWidgets/OrdersToolBar";
import Pagination from "@/components/widgets/OrdersWidgets/Pagination";

const OrdersTemplate = ({
  orders,
  totalOrders,
  isLoading,
  onItemsPerPageChanged,
  onPageChanged,
  onSearch,
  onSort,
  selectedStatus,
  changeSelectedSort,
  onOrderClick,
  refs,
}: any) => {
  return (
    <Box>
      <OrdersToolBar
        searchRef={refs.searchRef}
        onSearch={onSearch}
        onSort={onSort}
        selectedStatus={selectedStatus}
        sortRef={refs.sortRef}
      />
      <div className="  overflow-y-scroll  bg-n10 pb-20">
        <OrdersTable
          isLoading={isLoading}
          orders={orders}
          onSort={onSort}
          changeSelectedSort={changeSelectedSort}
          onOrderClick={onOrderClick}
        />
      </div>
      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        <Pagination
          ref={refs.paginationRef}
          selectedStatus={selectedStatus}
          totalItems={totalOrders}
          onItemsPerPageChanged={onItemsPerPageChanged}
          onPageChanged={onPageChanged}
        />
      </div>
    </Box>
  );
};

export default OrdersTemplate;
