import Box from "@/components/widgets/Box";
import OrdersTable from "@/components/widgets/OrdersWidgets/OrdersTable";
import OrdersToolBar from "@/components/widgets/OrdersWidgets/OrdersToolBar";
import Pagination from "@/components/widgets/OrdersWidgets/Pagination";

const OrdersLayout = ({ orders, totalOrders }: any) => {
  return (
    <Box>
      <div className="absolute left-0 right-0 top-0 z-30 h-20 w-full bg-n10">
        <OrdersToolBar />
      </div>
      <div className="mt-16 flex  w-full overflow-y-scroll  bg-n10 px-4">
        <OrdersTable isLoading={false} orders={orders} />
      </div>
      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        <Pagination totalItems={totalOrders} />
      </div>
    </Box>
  );
};

export default OrdersLayout;
