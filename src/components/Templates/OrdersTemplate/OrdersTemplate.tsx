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
}: any) => {
  return (
    <Box>
      <div className="absolute left-0 right-0 top-0 z-30 h-20 w-full bg-n10">
        <OrdersToolBar onSearch={onSearch} />
      </div>
      <div className="mt-16 flex  w-full overflow-y-scroll  bg-n10 px-4">
        <OrdersTable isLoading={isLoading} orders={orders} />
      </div>
      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        <Pagination
          totalItems={totalOrders}
          onItemsPerPageChanged={onItemsPerPageChanged}
          onPageChanged={onPageChanged}
        />
      </div>
    </Box>
  );
};

export default OrdersTemplate;
